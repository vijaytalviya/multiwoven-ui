import ContentContainer from '@/components/ContentContainer';
import TopBar from '@/components/TopBar';
import { Box, Divider, Text, useToast } from '@chakra-ui/react';
import { EDIT_SYNC_FORM_STEPS, SYNCS_LIST_QUERY_KEY } from '@/views/Activate/Syncs/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { editSync, getSyncById } from '@/services/syncs';
import Loader from '@/components/Loader';
import React, { useEffect, useState } from 'react';
import MappedInfo from './MappedInfo';
import moment from 'moment';
import SelectStreams from '@/views/Activate/Syncs/SyncForm/ConfigureSyncs/SelectStreams';
import MapFields from '../SyncForm/ConfigureSyncs/MapFields';
import { getConnectorInfo } from '@/services/connectors';
import {
  CreateSyncPayload,
  DiscoverResponse,
  FinalizeSyncFormFields,
  Stream,
} from '@/views/Activate/Syncs/types';
import ScheduleForm from './ScheduleForm';
import { FormikProps, useFormik } from 'formik';
import SyncActions from './SyncActions';
import SourceFormFooter from '@/views/Connectors/Sources/SourcesForm/SourceFormFooter';

const EditSync = (): JSX.Element | null => {
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [configuration, setConfiguration] = useState<Record<string, string> | null>(null);
  const { syncId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: syncFetchResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sync', syncId],
    queryFn: () => getSyncById(syncId as string),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!syncId,
  });

  const syncData = syncFetchResponse?.data.attributes;

  const { data: destinationFetchResponse, isLoading: isConnectorInfoLoading } = useQuery({
    queryKey: ['sync', 'destination', syncData?.destination.id],
    queryFn: () => getConnectorInfo(syncData?.destination.id as string),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!syncData?.destination.id,
  });

  const formik: FormikProps<FinalizeSyncFormFields> = useFormik({
    initialValues: {
      sync_mode: 'full_refresh',
      sync_interval: 0,
      sync_interval_unit: 'minutes',
      schedule_type: 'automated',
    },
    onSubmit: async (data) => {
      setIsEditLoading(true);
      try {
        if (
          destinationFetchResponse?.data.id &&
          syncData?.model.id &&
          syncData?.source.id &&
          configuration
        ) {
          const payload: CreateSyncPayload = {
            sync: {
              configuration,
              destination_id: destinationFetchResponse?.data.id,
              model_id: syncData?.model.id,
              schedule_type: data.schedule_type,
              source_id: syncData?.source.id,
              stream_name: syncData?.stream_name,
              sync_interval: data.sync_interval,
              sync_interval_unit: data.sync_interval_unit,
              sync_mode: data.sync_mode,
            },
          };

          const editSyncResponse = await editSync(payload, syncId as string);
          if (editSyncResponse.data.attributes) {
            toast({
              title: 'Sync updated successfully',
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'bottom-right',
            });

            queryClient.removeQueries({
              queryKey: SYNCS_LIST_QUERY_KEY,
            });

            navigate('/activate/syncs');
            return;
          }
        }
      } catch {
        toast({
          status: 'error',
          title: 'Error!!',
          description: 'Something went wrong while editing the sync',
          position: 'bottom-right',
          isClosable: true,
        });
      } finally {
        setIsEditLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isError) {
      toast({
        status: 'error',
        title: 'Error!!',
        description: 'Something went wrong',
        position: 'bottom-right',
        isClosable: true,
      });
    }
  }, [isError]);

  useEffect(() => {
    if (syncFetchResponse) {
      formik.setValues({
        sync_interval: syncData?.sync_interval ?? 0,
        sync_interval_unit: syncData?.sync_interval_unit ?? 'minutes',
        sync_mode: syncData?.sync_mode ?? 'full_refresh',
        schedule_type: syncData?.schedule_type ?? 'automated',
      });

      setConfiguration(syncFetchResponse.data.attributes.configuration);
    }
  }, [syncFetchResponse]);

  const handleOnStreamsLoad = (catalog: DiscoverResponse) => {
    const { streams } = catalog.data.attributes.catalog;
    const selectedStream = streams.find(({ name }) => name === syncData?.stream_name);
    if (selectedStream) {
      setSelectedStream(selectedStream);
    }
  };
  const handleOnConfigChange = (config: Record<string, string>) => {
    setConfiguration(config);
  };

  return (
    <form onSubmit={formik.handleSubmit} style={{ backgroundColor: '#F9FAFB' }}>
      <ContentContainer>
        <TopBar
          name='Sync'
          breadcrumbSteps={EDIT_SYNC_FORM_STEPS}
          extra={
            syncData?.model ? (
              <Box display='flex' alignItems='center'>
                <MappedInfo
                  source={{
                    name: syncData?.model.connector.name,
                    icon: syncData?.model.connector.icon,
                  }}
                  destination={{
                    name: syncData?.destination.name,
                    icon: syncData?.destination.icon,
                  }}
                />
                <Divider
                  orientation='vertical'
                  height='24px'
                  borderColor='gray.500'
                  opacity='1'
                  marginX='13px'
                />
                <Text size='sm' fontWeight='medium'>
                  Last updated :{' '}
                </Text>
                <Text size='sm' fontWeight='semibold'>
                  {moment(syncData.updated_at).format('DD/MM/YYYY')}
                </Text>
                <SyncActions />
              </Box>
            ) : null
          }
        />
        {isLoading || isConnectorInfoLoading || !syncData ? <Loader /> : null}
        {syncData && destinationFetchResponse?.data ? (
          <React.Fragment>
            <SelectStreams
              model={syncData?.model}
              destination={destinationFetchResponse?.data}
              onStreamsLoad={handleOnStreamsLoad}
              isEdit
            />
            <MapFields
              model={syncData?.model}
              destination={destinationFetchResponse?.data}
              stream={selectedStream}
              handleOnConfigChange={handleOnConfigChange}
              data={configuration}
              isEdit
              configuration={configuration}
            />
            <ScheduleForm formik={formik} isEdit />
          </React.Fragment>
        ) : null}
        <SourceFormFooter
          ctaName='Save Changes'
          ctaType='submit'
          isCtaLoading={isEditLoading}
          isAlignToContentContainer
          isDocumentsSectionRequired
          isContinueCtaRequired
          isBackRequired
        />
      </ContentContainer>
    </form>
  );
};

export default EditSync;