"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  Car,
  ClipboardList,
  Upload,
  Loader2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { t } from "@/lib/i18n";
import { phoneRegisterOptions, withPhoneFilter, withYearFilter, YEAR_PATTERN, validateYearRange } from "@/lib/phone-validation";
import {
  NAME_MAX,
  EMAIL_MAX,
  PHONE_MAX,
  CAR_MAKE_MODEL_MAX,
  DESCRIPTION_MAX,
  CHASSIS_MAX,
} from "@/lib/field-limits";
import { toast } from "sonner";
import { CreateAccountPromptModal } from "@/components/CreateAccountPromptModal";

type CereOfertaFormValues = {
  name: string;
  phone: string;
  email: string;
  carMake: string;
  carModel: string;
  carYear: string;
  chassis: string;
  description: string;
};

const inputBase =
  "w-full p-4 pl-12 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all border";
const inputNormal = "border-slate-200";
const inputError = "border-red-500";

const CUSTOMER_NAME_KEY = "dtl_customer_name";
const CUSTOMER_EMAIL_KEY = "dtl_customer_email";
const CUSTOMER_PHONE_KEY = "dtl_customer_phone";
const CUSTOMER_SESSION_KEY = "dtl_customer_session";
const CARS_STORAGE_KEY = "dtl_customer_cars";

export function CereOfertaForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCreateAccountPrompt, setShowCreateAccountPrompt] = useState(false);
  const [successEmail, setSuccessEmail] = useState<string | undefined>();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CereOfertaFormValues>({
    mode: "onChange",
    defaultValues: { chassis: "" },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(CUSTOMER_SESSION_KEY) !== "true") return;
    const name = sessionStorage.getItem(CUSTOMER_NAME_KEY) ?? "";
    const email = sessionStorage.getItem(CUSTOMER_EMAIL_KEY) ?? "";
    const phone = sessionStorage.getItem(CUSTOMER_PHONE_KEY) ?? "";
    let carMake = "";
    let carModel = "";
    let carYear = "";
    let chassis = "";
    try {
      const cars = sessionStorage.getItem(CARS_STORAGE_KEY);
      if (cars) {
        const arr = JSON.parse(cars) as { carMake?: string; carModel?: string; carYear?: string; chassis?: string }[];
        const first = arr[0];
        if (first) {
          carMake = first.carMake ?? "";
          carModel = first.carModel ?? "";
          carYear = first.carYear ?? "";
          chassis = first.chassis ?? "";
        }
      }
    } catch {
      // ignore
    }
    if (name || email || phone || carMake || carModel || carYear || chassis) {
      reset({
        name,
        email,
        phone,
        carMake: carMake || getValues("carMake") || "",
        carModel: carModel || getValues("carModel") || "",
        carYear: carYear || getValues("carYear") || "",
        chassis: chassis || getValues("chassis") || "",
        description: getValues("description") || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount to prepopulate from session
  }, []);

  const onSubmit = (data: CereOfertaFormValues) => {
    setLoading(true);
    setSuccessEmail(data.email?.trim() || undefined);
    setSuccess(true);
    setShowCreateAccountPrompt(true);
    reset();
    setFile(null);
    toast.success(t("cereOferta.successToast"));
    setLoading(false);
  };

  if (success) {
    return (
      <>
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center border border-blue-100">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Cerere trimisă!
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {t("cereOferta.successMessage")}
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Trimite altă cerere
            </button>
          </div>
        </div>
        <CreateAccountPromptModal
          open={showCreateAccountPrompt}
          onClose={() => setShowCreateAccountPrompt(false)}
          source="quote"
          email={successEmail}
        />
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
          {t("cereOferta.title")}
        </h1>
        <p className="text-xl text-slate-500">
          Primește o ofertă personalizată pentru piese și manoperă.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-600" /> Date personale
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.name")} *
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="text"
                  {...register("name", { required: t("cereOferta.requiredName") })}
                  placeholder="Ex: Popescu Ion"
                  maxLength={NAME_MAX}
                  className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.email")} *
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  {...register("email", {
                    required: t("cereOferta.requiredEmail"),
                    validate: (v) =>
                      !v || v.includes("@") ? true : t("errors.emailIncludeAt"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("cereOferta.invalidEmail"),
                    },
                  })}
                  placeholder="Ex: ion@exemplu.ro"
                  maxLength={EMAIL_MAX}
                  className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.phone")} *
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="tel"
                  placeholder="07xx xxx xxx"
                  maxLength={PHONE_MAX}
                  className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
                  {...withPhoneFilter(
                    register("phone", phoneRegisterOptions(t("cereOferta.requiredPhone"), t("errors.phoneDigitsOnly")))
                  )}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Car size={20} className="text-blue-600" /> Detalii vehicul
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.carMake")} *
              </label>
              <div className="relative">
                <Car
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="text"
                  {...register("carMake", { required: t("cereOferta.requiredCarMake") })}
                  placeholder="Ex: BMW"
                  maxLength={CAR_MAKE_MODEL_MAX}
                  className={`${inputBase} ${errors.carMake ? inputError : inputNormal}`}
                />
              </div>
              {errors.carMake && (
                <p className="text-xs text-red-500 mt-1">{errors.carMake.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.carModel")} *
              </label>
              <div className="relative">
                <Car
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="text"
                  {...register("carModel", { required: t("cereOferta.requiredCarModel") })}
                  placeholder="Ex: Seria 3"
                  maxLength={CAR_MAKE_MODEL_MAX}
                  className={`${inputBase} ${errors.carModel ? inputError : inputNormal}`}
                />
              </div>
              {errors.carModel && (
                <p className="text-xs text-red-500 mt-1">{errors.carModel.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.carYear")} *
              </label>
              <div className="relative">
                <Car
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Ex: 2018"
                  className={`${inputBase} ${errors.carYear ? inputError : inputNormal}`}
                  {...withYearFilter(
                    register("carYear", {
                      required: t("cereOferta.requiredCarYear"),
                      pattern: { value: YEAR_PATTERN, message: t("errors.carYearDigitsOnly") },
                      validate: (v) => {
                        const key = validateYearRange(v);
                        return key ? t("errors." + key) : true;
                      },
                    })
                  )}
                />
              </div>
              {errors.carYear && (
                <p className="text-xs text-red-500 mt-1">{errors.carYear.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ClipboardList size={20} className="text-blue-600" /> Detalii ofertă
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.chassis")} *
              </label>
              <input
                type="text"
                placeholder={t("cereOferta.chassisPlaceholder")}
                maxLength={CHASSIS_MAX}
                className={`w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all border ${errors.chassis ? inputError : inputNormal}`}
                {...((): ReturnType<typeof register> => {
                  const { ref, onChange, ...rest } = register("chassis", {
                    required: t("cereOferta.requiredChassis"),
                    pattern: { value: /^[A-Z0-9\-]*$/, message: t("cereOferta.chassisFormat") },
                  });
                  return {
                    ...rest,
                    ref,
                    onChange: (e: { target: { value: string } }) => {
                      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9\-]/g, "");
                      return onChange(e);
                    },
                  };
                })()}
              />
              {errors.chassis && (
                <p className="text-xs text-red-500 mt-1">{errors.chassis.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.description")} *
              </label>
              <textarea
                {...register("description", { required: t("cereOferta.requiredDescription") })}
                rows={4}
                maxLength={DESCRIPTION_MAX}
                placeholder={t("cereOferta.descriptionPlaceholder")}
                className={`w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none border ${errors.description ? "border-red-500" : inputNormal}`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.attachPhoto")}
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
                >
                  {file ? (
                    <div className="flex items-center gap-2 text-blue-600 font-bold">
                      <CheckCircle2 size={24} />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload
                        size={32}
                        className="text-slate-400 mb-2 group-hover:text-blue-500 transition-colors"
                      />
                      <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">
                        Apasă pentru a alege un fișier
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Imagini sau PDF (max. 5MB)
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              {t("cereOferta.submitRequest")} <ChevronRight size={24} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
