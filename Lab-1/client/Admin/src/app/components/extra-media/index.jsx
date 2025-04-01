import { Formik } from "formik";
import { useDispatch } from "react-redux";

import Button from "../button";
import UploadFileContainer from "../upload-file-container";
import Input from "../input";
import { milestoneAttachmentValidation } from "../../helper/validations";
import { uploadExtraMedia } from "../../redux/reducers/projectSlice";
import { showError } from "../../helper/toast";
import { useAppSelector } from "../../redux/hooks";
import { reconstructFile } from "../../helper/utils";

const ExtraMediaUpload = ({ data, onRefresh }) => {
  const dispatch = useDispatch();

  const user = useAppSelector((state) => {
    return state.authSlice.admin;
  });

  const handleExtraMedia = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    const checkTitle = checkTitleExistence(values?.attachmentTitle);

    if (checkTitle) {
      setSubmitting(false);
      return alert(
        "This title already exists. Please enter a different title."
      );
    }

    try {
      let formdata = new FormData();
      formdata.append("title", values?.attachmentTitle);
      formdata.append("jobId", data?.jobId);
      formdata.append("uploadedBy", user?.id);
      formdata.append("milestoneId", data?.id);
      values?.uploadAttachment.forEach((newMedia) => {
        const fileData = reconstructFile(
          newMedia.base64,
          newMedia.name,
          newMedia.type
        );
        formdata.append("extraMedia", fileData);
      });

      await dispatch(uploadExtraMedia(formdata))
        .unwrap()
        .then((res) => {
          if (res?.status === "success") {
            onRefresh();
            resetForm({
              values: { attachmentTitle: "", uploadAttachment: [] },
            });
          }
        });
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const checkTitleExistence = (title) => {
    return data?.MilestoneExtraMedia?.some(
      (milestone) => milestone.title === title
    );
  };

  const handleChange = (keyname, val, setFieldValue) => {
    setFieldValue(keyname, val);
  };
  return (
    <div>
      <Formik
        initialValues={{
          attachmentTitle: "",
          uploadAttachment: [],
        }}
        validationSchema={milestoneAttachmentValidation}
        onSubmit={handleExtraMedia}
      >
        {({
          isSubmitting,
          resetForm,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => {
          return (
            <div className="flex flex-col">
              <>
                <div>
                  <div className="my-3">
                    <h2 className="text-[16px] font-medium text-[#000] !font-poppins">
                      Attachment Title
                    </h2>
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter title"
                    className={"!font-openSans bg-transparent"}
                    value={values?.attachmentTitle}
                    containerClass={`!mb-[14px]`}
                    onChange={(e) => {
                      handleChange(
                        "attachmentTitle",
                        e.target.value,
                        setFieldValue
                      );
                    }}
                    error={
                      errors?.attachmentTitle && touched.attachmentTitle
                        ? errors?.attachmentTitle
                        : ""
                    }
                  />
                </div>
                <div className="my-3">
                  <h2 className="text-[16px] font-medium text-[#000] !font-poppins">
                    Upload Attachments
                  </h2>
                </div>
                <UploadFileContainer
                  containerClass={`mb-[26px]`}
                  description={`upload attachments`}
                  acceptType={"image/*,video/*,.pdf"}
                  selectedFiles={values?.uploadAttachment}
                  onChange={(files) => {
                    handleChange("uploadAttachment", files, setFieldValue);
                  }}
                  limit={15}
                  error={
                    errors?.uploadAttachment && touched.uploadAttachment
                      ? errors?.uploadAttachment
                      : ""
                  }
                />
                <Button
                  onClick={() => handleSubmit()}
                  type="submit"
                  isLoading={isSubmitting}
                  buttonclassName={"bg-[#294890] w-full self-end"}
                >
                  {"Save Attachments"}
                </Button>
              </>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default ExtraMediaUpload;
