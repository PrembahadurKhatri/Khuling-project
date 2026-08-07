import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitGeneralApplication } from "../services/applicationService.js";
import PageHeader from "../components/PageHeader.jsx";
import ApplicationFormFields from "../components/ApplicationFormFields.jsx";

const GeneralApplication = () => {
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (values.phone) formData.append("phone", values.phone);
      formData.append("resume", values.resume[0]);
      if (values.coverLetter?.[0]) formData.append("coverLetter", values.coverLetter[0]);
      if (values.links?.github) formData.append("links.github", values.links.github);
      if (values.links?.linkedin) formData.append("links.linkedin", values.links.linkedin);
      if (values.links?.other) formData.append("links.other", values.links.other);

      await submitGeneralApplication(formData);
      reset();
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Something went wrong submitting your application. Please try again.");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Careers"
        title="Don't see a fit today? Introduce yourself anyway."
        crumb="Home / Careers / General Application"
      >
        Send us your CV and we'll reach out when a role that matches your profile opens up.
      </PageHeader>

      <section className="section flex justify-center">
        <div className="card p-8 max-w-lg w-full">
          {submitted ? (
            <div className="text-center py-6">
              <h3 className="font-body text-xl text-navy mb-2">Thanks for reaching out!</h3>
              <p className="text-navy/70 leading-relaxed">
                We've received your application and will contact you if a position opens up that matches your profile.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-line mt-6 !py-2.5 !text-xs">
                Submit Another
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-body text-xl text-navy mb-6">General Application</h3>
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-600">{submitError}</div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <ApplicationFormFields register={register} />
                <button type="submit" disabled={isSubmitting} className="btn-fill w-full justify-center">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default GeneralApplication;
