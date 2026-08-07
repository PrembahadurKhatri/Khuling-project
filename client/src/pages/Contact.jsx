import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api.js";
import { fetchSettings } from "../services/settingsService.js";
import PageHeader from "../components/PageHeader.jsx";
import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
const Contact = () => {
  const [mode, setMode] = useState("contact");
  const [status, setStatus] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm();
  const { data } = useQuery({ queryKey: ["public-settings"], queryFn: fetchSettings });
  const settings = data?.data || {};

  const onSubmit = async (values) => {
    try {
      await api.post("/contact", { ...values, type: mode });
      setStatus("success");
      reset();
      setValue("phone","");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Get in Touch"
        title="Send us the brief. We'll send back a real estimate."
        crumb="Home / Contact"
      />

      <section className="container-wide py-24 md:py-28 grid lg:grid-cols-12 gap-14 md:gap-16">

        {/* LEFT */}
    <div className="lg:col-span-4 space-y-6">
  <p className="eyebrow mb-6">Reach Us</p>

  <div className="space-y-5">

    {/* Office */}
    <div className="card group relative p-6 flex gap-4 items-start rounded-xl overflow-hidden
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* left accent bar on hover */}
      <span className="absolute left-0 top-0 h-full w-[3px] bg-navy
                        scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

      <div className="relative w-11 h-11 rounded-md bg-teal/10 flex items-center justify-center shrink-0
                       ring-1 ring-teal/20 group-hover:ring-gold/40 group-hover:bg-gold/10
                       transition-all duration-300">
        <HiLocationMarker className="text-navy text-lg group-hover:text-gold transition-colors duration-300" />
      </div>
      <div className="space-y-1">
        <p className="font-body text-[11px] font-semibold tracking-widest2 uppercase text-navy/70
                       group-hover:text-navy transition-colors duration-300">
          Office
        </p>
        <p className="text-navy/70 text-sm leading-relaxed font-body">
          {settings.address || "Kathmandu, Nepal"}
        </p>
      </div>
    </div>

    {/* Phone */}
    <div className="card group relative p-6 flex gap-4 items-start rounded-xl overflow-hidden
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <span className="absolute left-0 top-0 h-full w-[3px] bg-navy
                        scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

      <div className="relative w-11 h-11 rounded-md bg-teal/10 flex items-center justify-center shrink-0
                       ring-1 ring-teal/20 group-hover:ring-gold/40 group-hover:bg-gold/10
                       transition-all duration-300">
        <HiPhone className="text-navy text-lg group-hover:text-gold transition-colors duration-300" />
      </div>
      <div className="space-y-1">
        <p className="font-body text-[11px] font-semibold tracking-widest2 uppercase text-navy/70
                       group-hover:text-navy transition-colors duration-300">
          Phone
        </p>
        <p className="text-navy/70 text-sm font-body">
          {settings.phone || "+977-1-XXXXXXX"}
        </p>
        {settings.emergencyContact && (
          <p className="inline-flex items-center gap-1.5 text-xs text-red-600 mt-1.5 font-semibold
                         bg-red-50 border border-red-100 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {settings.emergencyContact}
          </p>
        )}
      </div>
    </div>

    {/* Email */}
    <div className="card group relative p-6 flex gap-4 items-start rounded-xl overflow-hidden
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <span className="absolute left-0 top-0 h-full w-[3px] bg-navy
                        scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

      <div className="relative w-11 h-11 rounded-md bg-teal/10 flex items-center justify-center shrink-0
                       ring-1 ring-teal/20 group-hover:ring-gold/40 group-hover:bg-gold/10
                       transition-all duration-300">
        <HiMail className="text-navy text-lg group-hover:text-gold transition-colors duration-300" />
      </div>
      <div className="space-y-1">
        <p className="font-body text-[11px] font-semibold tracking-widest2 uppercase text-navy/70
                       group-hover:text-navy transition-colors duration-300">
          Email
        </p>
        <p className="text-navy/70 text-sm font-body">
          {settings.email || "info@khilungkalika.com"}
        </p>
      </div>
    </div>

  </div>
</div>

        {/* RIGHT */}
        <div className="lg:col-span-8">
          <div className="card p-8 md:p-10 rounded-2xl shadow-soft hover:shadow-card transition-all duration-500">

            {/* TOGGLE */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setMode("contact")}
                className={`${mode === "contact" ? "btn-fill" : "btn-line"} !py-2.5 !text-xs rounded-full transition-all duration-300 hover:scale-105`}
              >
                General Inquiry
              </button>
              <button
                onClick={() => setMode("quote")}
                className={`${mode === "quote" ? "btn-fill" : "btn-line"} !py-2.5 !text-xs rounded-full transition-all duration-300 hover:scale-105`}
              >
                Request a Quote
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-x-6 gap-y-5">

              <input {...register("name", { required: true })} placeholder="Full Name" className="input-field focus:shadow-md transition-all duration-300" />
              <input {...register("email", { required: true })} type="email" placeholder="Email" className="input-field focus:shadow-md transition-all duration-300" />
              <input type="hidden" {...register("phone")} />

              <div className="sm:col-span-1">
                <PhoneInput
                  country={"np"}
                  enableSearch
                  onChange={(phone) => setValue("phone", phone)}
                  inputClass="!w-full !h-[48px] !pl-[52px] !rounded-lg !border !border-line !bg-white"
                  buttonClass="!border-line"
                />
              </div>
              {mode === "quote" ? (
                <input {...register("projectType")} placeholder="Project Type" className="input-field focus:shadow-md transition-all duration-300" />
              ) : (
                <input {...register("subject")} placeholder="Subject" className="input-field focus:shadow-md transition-all duration-300" />
              )}

              <textarea
                {...register("message", { required: true })}
                placeholder="Message"
                rows={5}
                className="sm:col-span-2 input-field resize-none focus:shadow-md transition-all duration-300"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-fill sm:col-span-2 justify-center mt-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

            </form>

            {/* STATUS */}
            {status === "success" && (
              <div className="mt-5 p-4 bg-teal/10 border border-teal/20 rounded-lg text-teal-dark text-sm font-body font-semibold">
                Thank you! We'll be in touch shortly.
              </div>
            )}

            {status === "error" && (
              <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-lg font-body text-red-600 text-sm font-semibold">
                Something went wrong. Please try again.
              </div>
            )}

          </div>
        </div>
      </section>

 <section className="h-96 border-t border-line relative overflow-hidden">
  <iframe
    title="office-location"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4266.22708516312!2d83.9949601117577!3d28.22196547579089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995943668ae901d%3A0x2fa2e2b8cd013728!2sSoch%20College%20of%20IT!5e1!3m2!1sen!2snp!4v1786094140786!5m2!1sen!2snp"
    className="w-full h-full border-0 grayscale-[20%] contrast-[1.1] hover:grayscale-0 transition duration-500"
    loading="lazy"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  />
</section>
    </div>
  );
};

export default Contact;
