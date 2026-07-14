import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  age: '',
  gender: '',
  goal_physique: '',
  height: '',
  weight: '',
  preferred_trainer: '',
};

export default function EnquiryForm() {
  const [trainers, setTrainers] = useState([]);

  const [formData, setFormData] = useState(
    initialFormData
  );

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');

  const [messageType, setMessageType] =
    useState('');

  const [loadingTrainers, setLoadingTrainers] =
    useState(true);

  useEffect(() => {
    fetchTrainers();

    if (window.selectedTrainer) {
      setFormData((prev) => ({
        ...prev,
        preferred_trainer:
          window.selectedTrainer.name,
      }));

      window.selectedTrainer = null;
    }
  }, []);

  // ==========================================
  // FETCH TRAINERS
  // ==========================================

  const fetchTrainers = async () => {
    try {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .order('id');

      if (error) {
        throw error;
      }

      setTrainers(data || []);
    } catch (error) {
      console.error(
        'ERROR FETCHING TRAINERS:',
        error
      );
    } finally {
      setLoadingTrainers(false);
    }
  };

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE FORM SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    setMessage('');

    setMessageType('');

    console.log('================================');

    console.log(
      'ALBO WEBSITE ENQUIRY SUBMIT STARTED'
    );

    console.log('FORM DATA:', formData);

    try {
      // ========================================
      // PREPARE ENQUIRY
      // ========================================

      const enquiryPayload = {
        name: formData.name.trim(),

        email: formData.email
          .trim()
          .toLowerCase(),

        phone: formData.phone.trim(),

        age: Number(formData.age),

        gender: formData.gender,

        goal_physique:
          formData.goal_physique,

        height: Number(formData.height),

        weight: Number(formData.weight),

        preferred_trainer:
          formData.preferred_trainer || null,
      };

      console.log(
        'ENQUIRY PAYLOAD:',
        enquiryPayload
      );

      // ========================================
      // STEP 1 — SAVE ENQUIRY
      // ========================================

      console.log(
        'STEP 1: SAVING ENQUIRY TO SUPABASE'
      );

   const { error: enquiryError } = await supabase
  .from('enquiries')
  .insert([enquiryPayload]);

console.log(
  'ENQUIRY DATABASE ERROR:',
  enquiryError
);
      if (enquiryError) {
        throw new Error(
          `Database error: ${enquiryError.message}`
        );
      }

      console.log(
        'ENQUIRY SAVED SUCCESSFULLY'
      );

      // ========================================
      // STEP 2 — CALL EDGE FUNCTION
      // ========================================

      console.log(
        'STEP 2: CALLING EDGE FUNCTION'
      );

      console.log(
        'FUNCTION NAME: send-enquiry-thank-you'
      );

      const emailPayload = {
        name: enquiryPayload.name,

        email: enquiryPayload.email,

        goal_physique:
          enquiryPayload.goal_physique,

        preferred_trainer:
          enquiryPayload.preferred_trainer || '',
      };

      console.log(
        'EMAIL FUNCTION PAYLOAD:',
        emailPayload
      );

      const {
  data: emailData,
  error: emailError,
} = await supabase.functions.invoke(
  'send-enquiry-thank-you',
  {
    body: emailPayload,
  }
);

console.log(
  'EDGE FUNCTION DATA:',
  emailData
);

console.log(
  'EDGE FUNCTION ERROR:',
  emailError
);

// ========================================
// EMAIL ERROR
// ========================================

if (emailError) {
  console.error(
    'THANK-YOU EMAIL FUNCTION FAILED:',
    emailError
  );

  let functionErrorBody = null;

  try {
    if (emailError.context) {
      functionErrorBody =
        await emailError.context.json();
    }

    console.error(
      'EDGE FUNCTION ERROR BODY:',
      functionErrorBody
    );

    console.error(
      'RESEND STATUS:',
      functionErrorBody?.resendStatus
    );

    console.error(
      'RESEND ERROR:',
      functionErrorBody?.resendError
    );
  } catch (errorBodyError) {
    console.error(
      'UNABLE TO READ EDGE FUNCTION ERROR BODY:',
      errorBodyError
    );
  }

  setMessageType('warning');

  setMessage(
    'Your enquiry was received successfully. Our team will contact you soon.'
  );
} else if (
  emailData?.success === false
) {
  console.error(
    'EMAIL PROVIDER REPORTED FAILURE:',
    emailData
  );

  setMessageType('warning');

  setMessage(
    'Your enquiry was received successfully. Our team will contact you soon.'
  );
} else {
  console.log(
    'THANK-YOU EMAIL SENT SUCCESSFULLY'
  );

  console.log(
    'EMAIL ID:',
    emailData?.emailId
  );

  setMessageType('success');

  setMessage(
    'Enquiry submitted successfully! Check your email. Our team will contact you soon.'
  );
}

      // ========================================
      // RESET FORM
      // ========================================

      setFormData(initialFormData);

      console.log(
        'ALBO ENQUIRY PROCESS COMPLETED'
      );

      console.log('================================');
    } catch (error) {
      console.error('================================');

      console.error(
        'ALBO ENQUIRY SUBMIT FAILED'
      );

      console.error(error);

      setMessageType('error');

      setMessage(
        error?.message ||
          'Unable to submit your enquiry. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact-form"
      className="relative overflow-hidden bg-black py-24"
    >
      {/* Background */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#E85D2A] to-transparent" />

        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4">
        {/* ====================================
            HEADER
        ==================================== */}

        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
            Get Started
          </p>

          <h2 className="text-5xl font-black uppercase leading-[0.9] text-white md:text-6xl">
            Start Your
            <br />

            <span className="text-orange-500">
              Transformation
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-gray-400">
            Tell us about your fitness goal.
            Our ALBO team will contact you within
            the next few hours.
          </p>
        </div>

        {/* ====================================
            FORM CONTAINER
        ==================================== */}

        <div className="border-2 border-gray-800 bg-gray-950 p-6 md:p-12">
          {/* MESSAGE */}

          {message && (
            <div
              className={`mb-8 flex items-start gap-3 border p-4 ${
                messageType === 'success'
                  ? 'border-green-500/40 bg-green-500/10 text-green-300'
                  : messageType === 'warning'
                    ? 'border-orange-500/40 bg-orange-500/10 text-orange-300'
                    : 'border-red-500/40 bg-red-500/10 text-red-300'
              }`}
            >
              {messageType === 'success' ? (
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0"
                />
              ) : (
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />
              )}

              <p className="text-sm font-semibold leading-6">
                {message}
              </p>
            </div>
          )}

          {/* ==================================
              FORM
          ================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* NAME + EMAIL */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormInput
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <FormInput
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PHONE + AGE */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormInput
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <FormInput
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
                min="12"
                max="100"
              />
            </div>

            {/* GENDER + GOAL */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormSelect
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </FormSelect>

              <FormSelect
                name="goal_physique"
                value={formData.goal_physique}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Goal
                </option>

                <option value="Weight Loss">
                  Weight Loss
                </option>

                <option value="Muscle Gain">
                  Muscle Gain
                </option>

                <option value="Toning">
                  Toning
                </option>

                <option value="Flexibility">
                  Flexibility
                </option>

                <option value="General Fitness">
                  General Fitness
                </option>
              </FormSelect>
            </div>

            {/* HEIGHT + WEIGHT */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormInput
                type="number"
                step="0.01"
                name="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={handleChange}
                required
                min="50"
                max="300"
              />

              <FormInput
                type="number"
                step="0.01"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
                required
                min="20"
                max="500"
              />
            </div>

            {/* TRAINER */}

            <div>
              <label className="mb-3 block text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                Preferred Trainer — Optional
              </label>

              <FormSelect
                name="preferred_trainer"
                value={
                  formData.preferred_trainer
                }
                onChange={handleChange}
              >
                <option value="">
                  Select a trainer
                </option>

                {loadingTrainers ? (
                  <option disabled>
                    Loading trainers...
                  </option>
                ) : (
                  trainers.map((trainer) => (
                    <option
                      key={trainer.id}
                      value={trainer.name}
                    >
                      {trainer.name}
                      {trainer.specialization
                        ? ` — ${trainer.specialization}`
                        : ''}
                    </option>
                  ))
                )}
              </FormSelect>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Select a trainer or choose one from
                the trainer section above.
              </p>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 bg-orange-500 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />

                  Submit Enquiry
                </>
              )}
            </button>
          </form>

          {/* TERMS */}

          <p className="mt-7 text-center text-xs leading-5 text-gray-500">
            By submitting this form, you agree to
            be contacted by the ALBO FITNESS team
            regarding your enquiry.
          </p>
        </div>
      </div>
    </section>
  );
}

// ==============================================
// FORM INPUT
// ==============================================

function FormInput({
  className = '',
  ...props
}) {
  return (
    <input
      {...props}
      className={`w-full border-2 border-gray-800 bg-gray-900 px-4 py-4 font-semibold text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500 ${className}`}
    />
  );
}

// ==============================================
// FORM SELECT
// ==============================================

function FormSelect({
  children,
  className = '',
  ...props
}) {
  return (
    <select
      {...props}
      className={`w-full border-2 border-gray-800 bg-gray-900 px-4 py-4 font-semibold text-white outline-none transition focus:border-orange-500 ${className}`}
    >
      {children}
    </select>
  );
}