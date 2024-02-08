import ContentContainer from "@/components/ContentContainer";
import { SteppedFormContext } from "@/components/SteppedForm/SteppedForm";
import { createSync } from "@/services/syncs";
import SourceFormFooter from "@/views/Connectors/Sources/SourcesForm/SourceFormFooter";
import {
  Box,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { ConfigSync } from "../../types";
import { useNavigate } from "react-router-dom";

const FinaliseSync = (): JSX.Element => {
  const { state } = useContext(SteppedFormContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  const { forms } = state;
  const syncConfigForm = forms.find(
    (form) => form.stepKey === "configureSyncs"
  );
  const syncConfigData = syncConfigForm?.data;

  const formik = useFormik({
    initialValues: {
      description: "",
      sync_mode: "full_refresh",
      sync_interval: 0,
      sync_interval_unit: "minutes",
      schedule_type: "automated",
    },
    onSubmit: async (data) => {
      setIsLoading(true);
      try {
        const payload = {
          sync: {
            ...data,
            ...((syncConfigData?.configureSyncs ?? {}) as ConfigSync),
          },
        };

        const response = await createSync(payload);
        if (response?.data?.attributes) {
          toast({
            status: "success",
            title: "Success!!",
            description: "Sync created successfully!",
            position: "bottom-right",
          });

          navigate("/activate/syncs");
          return;
        }
        throw new Error();
      } catch {
        toast({
          status: "error",
          title: "An error occurred.",
          description: "Something went wrong while creating Sync.",
          position: "bottom-right",
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box display="flex" width="100%" justifyContent="center">
      <ContentContainer>
        <form onSubmit={formik.handleSubmit}>
          <Box
            backgroundColor="gray.300"
            padding="20px"
            borderRadius="8px"
            marginBottom="100px"
          >
            <Text fontWeight="600" marginBottom="20px">
              Finalise setting for this sync
            </Text>
            <Text marginBottom="10px">Description (Optional)</Text>
            <Textarea
              name="description"
              value={formik.values.description}
              placeholder="Enter a description"
              background="#fff"
              resize="none"
              marginBottom="30px"
              onChange={formik.handleChange}
            />

            <Box display="flex">
              <Box minWidth="500px">
                <Text marginBottom="20px" fontWeight="600">
                  Schedule type
                </Text>
                <RadioGroup
                  name="schedule_type"
                  value={formik.values.schedule_type}
                  onClick={formik.handleChange}
                >
                  <Stack direction="column">
                    <Radio
                      value="manual"
                      display="flex"
                      alignItems="flex-start"
                      marginBottom="10px"
                      backgroundColor="#fff"
                      isDisabled
                    >
                      <Box position="relative" top="-5px">
                        <Text fontWeight="500">Manual </Text>
                        <Text fontSize="sm">
                          Trigger your sync manually in the app or using our API{" "}
                        </Text>
                      </Box>
                    </Radio>
                    <Radio
                      value="automated"
                      display="flex"
                      alignItems="flex-start"
                      backgroundColor="#fff"
                      marginBottom="10px"
                    >
                      <Box position="relative" top="-5px">
                        <Text fontWeight="500">Interval </Text>
                        <Text fontSize="sm">
                          Schedule your sync to run on a set interval (e.g.,
                          once per hour)
                        </Text>
                      </Box>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              <Box minWidth="400px">
                {formik.values.schedule_type === "automated" ? (
                  <>
                    <Text marginBottom="20px" fontWeight="600">
                      Schedule Configuration
                    </Text>
                    <Box
                      border="thin"
                      padding="5px 10px 5px 20px"
                      display="flex"
                      backgroundColor="#fff"
                      borderRadius="8px"
                      alignItems="center"
                    >
                      <Box>
                        <Text>Every</Text>
                      </Box>
                      <Box>
                        <Input
                          name="sync_interval"
                          pr="4.5rem"
                          type="number"
                          placeholder="Enter a value"
                          border="none"
                          _focusVisible={{ border: "#fff" }}
                          value={formik.values.sync_interval}
                          onChange={formik.handleChange}
                          isRequired
                        />
                      </Box>
                      <Divider
                        orientation="vertical"
                        height="24px"
                        color="gray.400"
                      />
                      <Box>
                        <Select
                          name="sync_interval_unit"
                          border="none"
                          _focusVisible={{ border: "#fff" }}
                          value={formik.values.sync_interval_unit}
                          onChange={formik.handleChange}
                        >
                          <option value="minutes">Minute(s)</option>
                        </Select>
                      </Box>
                    </Box>
                  </>
                ) : null}
              </Box>
            </Box>
          </Box>
          <SourceFormFooter
            ctaName="Finish"
            ctaType="submit"
            isCtaLoading={isLoading}
          />
        </form>
      </ContentContainer>
    </Box>
  );
};

export default FinaliseSync;