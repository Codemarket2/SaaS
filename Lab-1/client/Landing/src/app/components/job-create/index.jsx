/**
 * JobCreateForm
 */
import { useRef } from "react";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import { FieldArray, Formik } from "formik";
import { FaCirclePlus } from "react-icons/fa6";

import Button from "../button";
import Input from "../input";
import MultilineInput from "../multiline-input";
import { milestoneJobValidation } from "../../helper/validations";
import CalendarIcon from "../../assets/icons/calendar.png";
import { FaRegTrashCan } from "react-icons/fa6";
import { showError } from "../../helper/toast";
import { useAppSelector } from "../../redux/hooks";
import { createNewJob } from "../../redux/reducers/projectSlice";

const JobCreateForm = ({ projectDetails, onRefresh }) => {
  const user = useAppSelector((state) => state.authSlice.admin);

  const datePickerRef = useRef(null);

  const initialValues = { jobs: [] };
  const dispatch = useDispatch();

  const addMilestone = async (values, jobAmount) => {
    try {
      const data = jobAmount
        ? {
            jobId: projectDetails?.id,
            UserId: user?.id,
            parentId: null,
            milestone: values.jobs.map((job) => {
              return {
                ...job,
                amount: job?.amount.trim()?.length === 0 ? "0" : job?.amount,
              };
            }),
            jobAmount,
          }
        : {
            jobId: projectDetails?.id,
            UserId: user?.id,
            parentId: null,
            milestone: values.jobs.map((job) => {
              return {
                ...job,
                amount: job?.amount.trim()?.length === 0 ? "0" : job?.amount,
              };
            }),
          };

      await dispatch(createNewJob({ jobDetails: data }))
        .unwrap()
        .then((res) => {
          if (res?.status === "success") onRefresh();
        });

      return true;
    } catch (error) {
      showError(error);
      return false;
    }
  };

  const handleCreateJob = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);
    try {
      let totalAmount = 0;
      totalAmount = [...projectDetails?.milestones, ...values?.jobs]?.reduce(
        (acc, milestone) => acc + (+milestone.amount ? +milestone.amount : 0),
        0
      );

      if (!projectDetails?.amount || !+projectDetails?.amount) {
        const success = addMilestone(values, totalAmount);
        success && resetForm({ values: initialValues });
      } else if (+totalAmount <= projectDetails?.amount) {
        const success = addMilestone(values);
        success && resetForm({ values: initialValues });
      } else if (+totalAmount > projectDetails?.amount) {
        const confirmation = window.confirm(
          `Total Must be Equal to the Offered project Amount. (${projectDetails?.amount})`,
          `Do you want to increase project amount to ${totalAmount} ?`
        );
        if (confirmation) {
          const success = await addMilestone(values, totalAmount);
          success && resetForm({ values: initialValues });
        }
      }
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ jobs: [] }}
        validationSchema={milestoneJobValidation}
        onSubmit={handleCreateJob}
      >
        {({
          isSubmitting,
          handleSubmit,
          setFieldValue,
          resetForm,
          values,
          errors,
          touched,
        }) => {
          return (
            <FieldArray name="jobs">
              {({ remove, push }) => {
                return (
                  <div>
                    {projectDetails?.status !== 3 && (
                      <div className="flex justify-end mt-5">
                        <Button
                          onClick={() =>
                            push({
                              mileStoneName: "",
                              description: "",
                              amount: "",
                              startdate: "",
                              enddate: "",
                            })
                          }
                          buttonclassName={"bg-[#294890]"}
                        >
                          {
                            <span className="flex items-center gap-2 font-poppins">
                              <FaCirclePlus />
                              <p className="font-poppins">Post a Job</p>
                            </span>
                          }
                        </Button>
                      </div>
                    )}
                    {values.jobs.map((job, index) => {
                      return (
                        <div key={index} className="flex flex-col mt-12">
                          <>
                            <div className="flex justify-between">
                              <div className="h-[30px] w-[30px] grid place-items-center border border-black rounded-full">
                                {index < 10
                                  ? `0${
                                      index +
                                      projectDetails?.milestones?.length +
                                      1
                                    }`
                                  : `${
                                      index +
                                      projectDetails?.milestones?.length +
                                      1
                                    }`}
                              </div>
                              <div onClick={() => remove(index)}>
                                <FaRegTrashCan className="self-end text-red-500 text-[24px] mr-5 cursor-pointer" />
                              </div>
                            </div>
                            <div>
                              <div className="my-3">
                                <h2 className="text-[16px] !font-poppins font-medium text-[#000]">
                                  Enter Job Name :
                                </h2>
                              </div>
                              <Input
                                type="text"
                                placeholder="Enter your job name"
                                className={"!font-openSans bg-transparent"}
                                value={values?.jobs?.[index]?.mileStoneName}
                                containerClass={`!mb-[14px]`}
                                onChange={(e) => {
                                  setFieldValue(
                                    `jobs.${index}.mileStoneName`,
                                    e.target.value
                                  );
                                }}
                                error={
                                  errors?.jobs?.[index]?.mileStoneName &&
                                  touched?.jobs?.[index]?.mileStoneName
                                    ? errors?.jobs?.[index]?.mileStoneName
                                    : ""
                                }
                              />
                            </div>
                            <div>
                              <div className="my-3">
                                <h2 className="text-[16px] font-medium text-[#000] !font-poppins">
                                  Job Description :
                                </h2>
                              </div>
                              <MultilineInput
                                type={"text"}
                                rows={3}
                                placeholder={"Type job description here..."}
                                value={values?.jobs?.[index]?.description}
                                handleChange={(e) =>
                                  setFieldValue(
                                    `jobs.${index}.description`,
                                    e.target.value
                                  )
                                }
                                error={
                                  errors?.jobs?.[index]?.description &&
                                  touched?.jobs?.[index]?.description
                                    ? errors?.jobs?.[index]?.description
                                    : ""
                                }
                                containerClass={`mb-[26px] `}
                                textareaClass={`!bg-transparent`}
                              />
                            </div>
                            <div>
                              <div className="my-3">
                                <h2 className="text-[16px] font-medium text-[#000] !font-poppins">
                                  Job Amount :
                                </h2>
                              </div>
                              <Input
                                type="text"
                                placeholder="Enter job amount"
                                className={"!font-openSans bg-transparent"}
                                value={values?.jobs?.[index]?.amount}
                                containerClass={`!mb-[14px]`}
                                onChange={(e) => {
                                  setFieldValue(
                                    `jobs.${index}.amount`,
                                    e.target.value
                                  );
                                }}
                                error={
                                  errors?.jobs?.[index]?.amount &&
                                  touched?.jobs?.[index]?.amount
                                    ? errors?.jobs?.[index]?.amount
                                    : ""
                                }
                              />
                            </div>
                            <div>
                              <div className="my-3">
                                <h2 className="text-[16px] !font-poppins font-medium text-[#000]">
                                  Estimated Job Duration :
                                </h2>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex flex-col w-[48%]">
                                  <div className="flex items-center h-[64px] w-[24x0px] overflow-hidden  focus-within:border-[#4c74d3] focus-within:border-[2px] border border-[#00000021] p-3 rounded-md bg-white">
                                    <div className="w-full">
                                      <DatePicker
                                        ref={datePickerRef}
                                        placeholderText="Start Date"
                                        enableTabLoop={false}
                                        selected={
                                          values?.jobs?.[index]?.startdate
                                        }
                                        popperPlacement="bottom-start"
                                        onChange={(date) =>
                                          setFieldValue(
                                            `jobs.${index}.startdate`,
                                            date
                                          )
                                        }
                                        dateFormat="dd MMM yyyy"
                                        className="border-none focus:outline-none datepicker text-black placeholder:font-openSans placeholder:font-normal placeholder:text-base placeholder-[#545458b3] font-openSans font-normal text-base"
                                        wrapperClassName="datepicker"
                                      />
                                    </div>
                                    <img
                                      src={CalendarIcon}
                                      className="h-5 "
                                      onClick={() =>
                                        !datePickerRef?.current?.isCalendarOpen() &&
                                        datePickerRef?.current?.setOpen(true)
                                      }
                                    />
                                  </div>
                                  {errors?.jobs?.[index]?.startdate &&
                                    touched?.jobs?.[index]?.startdate && (
                                      <div className="text-red-500 font-poppins font-normal text-base ">
                                        {errors?.jobs?.[index]?.startdate}
                                      </div>
                                    )}
                                </div>
                                <div className="flex flex-col w-[48%]">
                                  <div className="flex items-center h-[64px] w-[24x0px] overflow-hidden  focus-within:border-[#4c74d3] focus-within:border-[2px] border border-[#00000021] p-3 rounded-md bg-white">
                                    <div className="w-full">
                                      <DatePicker
                                        ref={datePickerRef}
                                        placeholderText="End Date"
                                        enableTabLoop={false}
                                        selected={
                                          values?.jobs?.[index]?.enddate
                                        }
                                        popperPlacement="bottom-start"
                                        onChange={(date) =>
                                          setFieldValue(
                                            `jobs.${index}.enddate`,
                                            date
                                          )
                                        }
                                        dateFormat="dd MMM yyyy"
                                        className="border-none focus:outline-none datepicker text-black placeholder:font-openSans placeholder:font-normal placeholder:text-base placeholder-[#545458b3] font-openSans font-normal text-base"
                                        wrapperClassName="datepicker"
                                      />
                                    </div>
                                    <img
                                      src={CalendarIcon}
                                      className="h-5 "
                                      onClick={() =>
                                        !datePickerRef?.current?.isCalendarOpen() &&
                                        datePickerRef?.current?.setOpen(true)
                                      }
                                    />
                                  </div>
                                  {errors?.jobs?.[index]?.enddate &&
                                    touched?.jobs?.[index]?.enddate && (
                                      <div className="text-red-500 font-poppins font-normal text-base ">
                                        {errors?.jobs?.[index]?.enddate}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </>
                        </div>
                      );
                    })}
                    {values?.jobs?.length > 0 && (
                      <Button
                        onClick={() => handleSubmit()}
                        type="submit"
                        isLoading={isSubmitting}
                        buttonclassName={"bg-[#294890] self-end mt-8"}
                      >
                        {"Submit"}
                      </Button>
                    )}
                  </div>
                );
              }}
            </FieldArray>
          );
        }}
      </Formik>
    </div>
  );
};

export default JobCreateForm;
