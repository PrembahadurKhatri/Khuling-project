import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api.js";
import { fetchSettings } from "../services/settingsService.js";
import PageHeader from "../components/PageHeader.jsx";

const fieldClass =
  "w-full border-b border-line bg-transparent px-0 py-2.5 text-navy placeholder:text-navy/40 focus:border-teal outline-none transition-colors";

const Contact = () => {
  const [mode, setMode] = useState("contact");
  const [status, setStatus] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const { data } = useQuery({ queryKey: ["public-settings"], queryFn: fetchSettings });
  const settings = data?.data || {};

  const onSubmit = async (values) => {
    try {
      await api.post("/contact", { ...values, type: mode });
      setStatus("success");
      reset();
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

      {/* Split: a plain mono contact list on the left, the form on the right —
          no matching icon-cards down the left rail. */}
      <section className="container-wide py-24 md:py-28 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">Reach Us</p>
          <div>
            <div className="py-5 border-t border-line">
              <p className="font-mono text-[11px] tracking-widest2 uppercase text-teal mb-2">Office</p>
              <p className="text-navy/70">{settings.address || "Kathmandu, Nepal"}</p>
            </div>
            <div className="py-5 border-t border-line">
              <p className="font-mono text-[11px] tracking-widest2 uppercase text-teal mb-2">Phone</p>
              <p className="text-navy/70">{settings.phone || "+977-1-XXXXXXX"}</p>
              {settings.emergencyContact && (
                <p className="text-xs text-gold-dark mt-1">Emergency: {settings.emergencyContact}</p>
              )}
            </div>
            <div className="py-5 border-t border-b border-line">
              <p className="font-mono text-[11px] tracking-widest2 uppercase text-teal mb-2">Email</p>
              <p className="text-navy/70">{settings.email || "info@khilungkalika.com"}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setMode("contact")}
              className={mode === "contact" ? "btn-fill !py-2.5" : "btn-line !py-2.5"}
            >
              General Inquiry
            </button>
            <button
              onClick={() => setMode("quote")}
              className={mode === "quote" ? "btn-fill !py-2.5" : "btn-line !py-2.5"}
            >
              Request a Quote
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
            <input {...register("name", { required: true })} placeholder="Full Name" className={fieldClass} />
            <input {...register("email", { required: true })} type="email" placeholder="Email" className={fieldClass} />
            <input {...register("phone")} placeholder="Phone" className={fieldClass} />
            {mode === "quote" ? (
              <input {...register("projectType")} placeholder="Project Type" className={fieldClass} />
            ) : (
              <input {...register("subject")} placeholder="Subject" className={fieldClass} />
            )}
            <textarea
              {...register("message", { required: true })}
              placeholder="Message"
              rows={5}
              className={`sm:col-span-2 mt-4 ${fieldClass}`}
            />
            <button type="submit" disabled={isSubmitting} className="btn-fill sm:col-span-2 justify-center mt-8">
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          {status === "success" && <p className="text-teal-dark mt-4">Thank you! We'll be in touch shortly.</p>}
          {status === "error" && <p className="text-red-600 mt-4">Something went wrong. Please try again.</p>}
        </div>
      </section>

      <section className="h-96 border-t border-line">
        <iframe
          title="office-location"
          src={settings.mapEmbedUrl || "https://www.google.com/maps?q=Kathmandu,Nepal&output=embed"}
          className="w-full h-full border-0 grayscale-[40%]"
          loading="lazy"
        />
      </section>
    </div>
  );
};

export default Contact;
