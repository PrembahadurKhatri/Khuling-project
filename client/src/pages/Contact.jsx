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

            <div className="card p-6 flex gap-4 items-start rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="w-11 h-11 rounded-md bg-teal/10 flex items-center justify-center shrink-0">
                <HiLocationMarker className="text-teal text-lg" />
              </div>
              <div className="space-y-1">
                <p className="font-body text-[11px] font-semibold tracking-widest2 uppercase text-teal">Office</p>
                <p className="text-navy/70 text-sm leading-relaxed">{settings.address || "Kathmandu, Nepal"}</p>
              </div>
            </div>

            <div className="card p-6 flex gap-4 items-start rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="w-11 h-11 rounded-md bg-teal/10 flex items-center justify-center shrink-0">
                <HiPhone className="text-teal text-lg" />
              </div>
              <div className="space-y-1">
                <p className="font-body text-[11px] font-semibold tracking-widest2 uppercase text-teal">Phone</p>
                <p className="text-navy/70 text-sm">{settings.phone || "+977-1-XXXXXXX"}</p>
                {settings.emergencyContact && (
                  <p className="text-xs text-gold-dark mt-1 font-semibold">{settings.emergencyContact}</p>
                )}
              </div>
            </div>

            <div className="card p-6 flex gap-4 items-start rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="w-11 h-11 rounded-md bg-teal/10 flex items-center justify-center shrink-0">
                <HiMail className="text-teal text-lg" />
              </div>
              <div className="space-y-1">
                <p className="font-body text-[11px] font-semibold tracking-widest2 uppercase text-teal">Email</p>
                <p className="text-navy/70 text-sm">{settings.email || "info@khilungkalika.com"}</p>
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
              <div className="mt-5 p-4 bg-teal/10 border border-teal/20 rounded-lg text-teal-dark text-sm font-semibold">
                Thank you! We'll be in touch shortly.
              </div>
            )}

            {status === "error" && (
              <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-semibold">
                Something went wrong. Please try again.
              </div>
            )}

          </div>
        </div>
      </section>

      <section className="h-96 border-t border-line relative overflow-hidden">
        <iframe
          title="office-location"
          src={settings.mapEmbedUrl || "https://www.google.com/maps?q=Kathmandu,Nepal&output=embed"}
          className="w-full h-full border-0 grayscale-[20%] contrast-[1.1] hover:grayscale-0 transition duration-500"
          loading="lazy"
        />
      </section>
    </div>
  );
};

export default Contact;
