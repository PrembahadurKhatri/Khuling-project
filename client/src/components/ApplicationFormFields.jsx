// Shared field set for both the per-job apply form (CareerDetail.jsx) and the
// General Application page — same required/optional fields either way:
// resume (required upload), cover letter (optional upload, not typed text),
// and optional GitHub/LinkedIn/other links. Used with react-hook-form's
// register() passed straight through from the parent form.
const fileInputClass = "input-field file:mr-4 file:py-1 file:px-3 file:border-0 file:bg-navy file:text-stone file:text-xs file:font-semibold file:uppercase";
const labelClass = "mb-2 block text-xs font-body font-semibold uppercase tracking-wide text-navy/60";

const ApplicationFormFields = ({ register }) => (
  <>
    <input {...register("name", { required: true })} placeholder="Full Name" className="input-field" />
    <input {...register("email", { required: true })} type="email" placeholder="Email" className="input-field" />
    <input {...register("phone")} placeholder="Phone" className="input-field" />

    <div>
      <label className={labelClass}>CV / Resume (PDF, JPG or PNG) *</label>
      <input
        {...register("resume", { required: true })}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className={fileInputClass}
      />
    </div>

    <div>
      <label className={labelClass}>Cover Letter (optional — PDF, JPG or PNG)</label>
      <input
        {...register("coverLetter")}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className={fileInputClass}
      />
    </div>

    <div>
      <label className={labelClass}>Links (all optional)</label>
      <div className="space-y-3">
        <input {...register("links.github")} placeholder="GitHub profile URL" className="input-field" />
        <input {...register("links.linkedin")} placeholder="LinkedIn profile URL" className="input-field" />
        <input {...register("links.other")} placeholder="Portfolio / other link" className="input-field" />
      </div>
    </div>
  </>
);

export default ApplicationFormFields;
