"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";

const serviceOptions = [
  { value: "ai-visibility-scan", label: "AI Visibility Scan" },
  { value: "schema-structured-data", label: "Schema & Structured Data" },
  { value: "content-optimization", label: "Content Optimization" },
  { value: "ai-monitoring", label: "Ongoing AI Monitoring" },
  { value: "full-geo-package", label: "Full GEO Package" },
  { value: "other", label: "Other" },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  business_name: string;
  service_type: string;
  city: string;
  message: string;
}

export function LeadForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    business_name: "",
    service_type: "",
    city: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong");
        return;
      }
      setStatus("success");
      setForm({ name: "", email: "", phone: "", business_name: "", service_type: "", city: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Failed to submit. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-xl font-bold text-green-800">Thank you!</h3>
        <p className="mt-2 text-green-700">
          We&apos;ve received your information and will be in touch within 24 hours.
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="name"
          label="Full Name *"
          placeholder="John Smith"
          required
          value={form.name}
          onChange={update("name")}
        />
        <Input
          id="email"
          label="Email *"
          type="email"
          placeholder="john@example.com"
          required
          value={form.email}
          onChange={update("email")}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="phone"
          label="Phone"
          type="tel"
          placeholder="(305) 555-1234"
          value={form.phone}
          onChange={update("phone")}
        />
        <Input
          id="business_name"
          label="Business Name"
          placeholder="Your Business LLC"
          value={form.business_name}
          onChange={update("business_name")}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          id="service_type"
          label="Service Needed *"
          options={serviceOptions}
          required
          value={form.service_type}
          onChange={update("service_type")}
        />
        <Input
          id="city"
          label="City *"
          placeholder="Salt Lake City"
          required
          value={form.city}
          onChange={update("city")}
        />
      </div>
      <Textarea
        id="message"
        label="Message"
        rows={4}
        placeholder="Tell us about your needs..."
        value={form.message}
        onChange={update("message")}
      />

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <Button type="submit" size="lg" disabled={status === "loading"} className="w-full">
        {status === "loading" ? "Submitting..." : "Get Your Free AI Visibility Scan"}
      </Button>
    </form>
  );
}
