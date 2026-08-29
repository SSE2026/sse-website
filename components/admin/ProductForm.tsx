"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import type { ProductCategory, ProductDetail } from "@/types/admin-product";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: ProductDetail;
  categories: ProductCategory[];
  initialCategoryId?: string | null;
}

type NumberFieldKey =
  | "nominalVoltage"
  | "nominalCapacity"
  | "energy"
  | "energyDensity"
  | "chargeRate"
  | "dischargeRate"
  | "peakDischargeRate"
  | "length"
  | "width"
  | "height"
  | "weight"
  | "cycleLife"
  | "operatingTempMin"
  | "operatingTempMax"
  | "moq"
  | "sortOrder";

type FormState = {
  sku: string;
  model: string;
  slug: string;
  categoryId: string;
  brand: string;
  chemistry: string;
  shortDescription: string;
  description: string;
  leadTime: string;
  nominalVoltage: string;
  nominalCapacity: string;
  energy: string;
  energyDensity: string;
  chargeRate: string;
  dischargeRate: string;
  peakDischargeRate: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  cycleLife: string;
  operatingTempMin: string;
  operatingTempMax: string;
  moq: string;
  sortOrder: string;
  sampleAvailable: boolean;
  customizationAvailable: boolean;
  published: boolean;
  featured: boolean;
};

const NUMBER_FIELDS: NumberFieldKey[] = [
  "nominalVoltage",
  "nominalCapacity",
  "energy",
  "energyDensity",
  "chargeRate",
  "dischargeRate",
  "peakDischargeRate",
  "length",
  "width",
  "height",
  "weight",
  "cycleLife",
  "operatingTempMin",
  "operatingTempMax",
  "moq",
  "sortOrder",
];

function emptyState(): FormState {
  return {
    sku: "",
    model: "",
    slug: "",
    categoryId: "",
    brand: "",
    chemistry: "",
    shortDescription: "",
    description: "",
    leadTime: "",
    nominalVoltage: "",
    nominalCapacity: "",
    energy: "",
    energyDensity: "",
    chargeRate: "",
    dischargeRate: "",
    peakDischargeRate: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    cycleLife: "",
    operatingTempMin: "",
    operatingTempMax: "",
    moq: "",
    sortOrder: "0",
    sampleAvailable: false,
    customizationAvailable: false,
    published: true,
    featured: false,
  };
}

function fromProduct(p?: ProductDetail): FormState {
  if (!p) return emptyState();
  const num = (v: number | null | undefined) =>
    v === null || v === undefined ? "" : String(v);
  return {
    sku: p.sku ?? "",
    model: p.model ?? "",
    slug: p.slug ?? "",
    categoryId: p.categoryId ?? "",
    brand: p.brand ?? "",
    chemistry: p.chemistry ?? "",
    shortDescription: p.shortDescription ?? "",
    description: p.description ?? "",
    leadTime: p.leadTime ?? "",
    nominalVoltage: num(p.nominalVoltage),
    nominalCapacity: num(p.nominalCapacity),
    energy: num(p.energy),
    energyDensity: num(p.energyDensity),
    chargeRate: num(p.chargeRate),
    dischargeRate: num(p.dischargeRate),
    peakDischargeRate: num(p.peakDischargeRate),
    length: num(p.length),
    width: num(p.width),
    height: num(p.height),
    weight: num(p.weight),
    cycleLife: num(p.cycleLife),
    operatingTempMin: num(p.operatingTempMin),
    operatingTempMax: num(p.operatingTempMax),
    moq: num(p.moq),
    sortOrder: num(p.sortOrder) || "0",
    sampleAvailable: p.sampleAvailable ?? false,
    customizationAvailable: p.customizationAvailable ?? false,
    published: p.published ?? false,
    featured: p.featured ?? false,
  };
}

function buildPayload(state: FormState): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  // Required string fields
  payload.sku = state.sku.trim();
  payload.model = state.model.trim();
  payload.slug = state.slug.trim();
  payload.categoryId = state.categoryId;

  // Optional strings: send empty string as null-ish (omit) to satisfy
  // class-validator's @IsString() without overwriting with null.
  const setIfPresent = (key: string, raw: string) => {
    const v = raw.trim();
    if (v.length > 0) payload[key] = v;
  };
  setIfPresent("brand", state.brand);
  setIfPresent("chemistry", state.chemistry);
  setIfPresent("shortDescription", state.shortDescription);
  setIfPresent("description", state.description);
  setIfPresent("leadTime", state.leadTime);

  // Numbers — only include when the field has a value, otherwise omit.
  for (const k of NUMBER_FIELDS) {
    const raw = (state[k] as string).trim();
    if (raw === "") continue;
    const n = Number(raw);
    if (Number.isFinite(n)) payload[k] = n;
  }

  // Booleans
  payload.sampleAvailable = state.sampleAvailable;
  payload.customizationAvailable = state.customizationAvailable;
  payload.published = state.published;
  payload.featured = state.featured;

  return payload;
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-medium text-[#52525B]"
    >
      {children}
      {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
    </label>
  );
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  required,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className="h-9 w-full rounded-md border border-[#E4E4E7] bg-white px-3 text-sm text-[#0A0A0A] placeholder:text-[#A1A1AA] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#FAFAFA] disabled:opacity-60"
    />
  );
}

function Textarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className="w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#0A0A0A] placeholder:text-[#A1A1AA] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#FAFAFA] disabled:opacity-60"
    />
  );
}

function Select({
  id,
  value,
  onChange,
  disabled,
  children,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="h-9 w-full rounded-md border border-[#E4E4E7] bg-white px-3 text-sm text-[#0A0A0A] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#FAFAFA] disabled:opacity-60"
    >
      {children}
    </select>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border border-[#E4E4E7] bg-white px-3 py-2.5",
        disabled && "opacity-60",
      )}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-[#0A0A0A]">{label}</div>
        {hint && <div className="mt-0.5 text-xs text-[#71717A]">{hint}</div>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
          checked ? "bg-[#2563EB]" : "bg-[#E4E4E7]",
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-[3px]",
          )}
        />
      </button>
    </label>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E4E4E7] bg-white p-5 md:p-6">
      <header className="mb-4 flex items-baseline justify-between gap-3">
        <h2
          className="text-sm font-semibold uppercase tracking-[0.12em] text-[#52525B]"
          style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
        >
          {title}
        </h2>
        {hint && <span className="text-xs text-[#A1A1AA]">{hint}</span>}
      </header>
      {children}
    </section>
  );
}

export function ProductForm({ mode, product, categories, initialCategoryId }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>(() => {
    const s = fromProduct(product);
    // For create mode with a preselected category, override the (empty) categoryId.
    if (mode === "create" && initialCategoryId) {
      s.categoryId = initialCategoryId;
    }
    return s;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!state.sku.trim() || !state.model.trim() || !state.slug.trim()) {
      setError("SKU, Model and Slug are required.");
      return;
    }
    if (!state.categoryId) {
      setError("Please select a category.");
      return;
    }

    setSubmitting(true);
    try {
      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${product!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(state)),
      });
      const data = await res.json().catch(() => ({} as Record<string, unknown>));

      if (!res.ok) {
        setError(
          (data as { error?: string }).error ||
            (data as { message?: string }).message ||
            `Request failed (${res.status})`,
        );
        setSubmitting(false);
        return;
      }

      startTransition(() => {
        router.push("/admin/products");
        router.refresh();
      });
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            strokeWidth={2}
          />
          <span>{error}</span>
        </div>
      )}

      <Section title="Identification" hint="Required fields are marked with *">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="sku" required>SKU</FieldLabel>
            <TextInput
              id="sku"
              value={state.sku}
              onChange={(v) => update("sku", v)}
              placeholder="例如：SSE-360P-001"
              disabled={submitting}
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="model" required>型号</FieldLabel>
            <TextInput
              id="model"
              value={state.model}
              onChange={(v) => update("model", v)}
              placeholder="例如：Aeroride 360-P"
              disabled={submitting}
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="slug" required>URL 别名</FieldLabel>
            <TextInput
              id="slug"
              value={state.slug}
              onChange={(v) => update("slug", v)}
              placeholder="例如：aeroride-360-p"
              disabled={submitting}
              required
            />
          </div>
          <div>
            <FieldLabel htmlFor="categoryId" required>分类</FieldLabel>
            <Select
              id="categoryId"
              value={state.categoryId}
              onChange={(v) => update("categoryId", v)}
              disabled={submitting}
            >
              <option value="">Select a category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.slug}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel htmlFor="brand">品牌</FieldLabel>
            <TextInput
              id="brand"
              value={state.brand}
              onChange={(v) => update("brand", v)}
              placeholder="例如：Swift Safe Energy"
              disabled={submitting}
            />
          </div>
          <div>
            <FieldLabel htmlFor="chemistry">化学体系</FieldLabel>
            <TextInput
              id="chemistry"
              value={state.chemistry}
              onChange={(v) => update("chemistry", v)}
              placeholder="例如：Li-ion"
              disabled={submitting}
            />
          </div>
        </div>
      </Section>

      <Section title="Descriptions">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="shortDescription">简短描述</FieldLabel>
            <TextInput
              id="shortDescription"
              value={state.shortDescription}
              onChange={(v) => update("shortDescription", v)}
              placeholder="一句话介绍"
              disabled={submitting}
            />
          </div>
          <div>
            <FieldLabel htmlFor="description">完整描述</FieldLabel>
            <Textarea
              id="description"
              value={state.description}
              onChange={(v) => update("description", v)}
              placeholder="营销文案、应用说明等"
              rows={5}
              disabled={submitting}
            />
          </div>
        </div>
      </Section>

      <Section title="Electrical specifications">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(
            [
              ["nominalVoltage", "Nominal voltage (V)"],
              ["nominalCapacity", "Capacity (Ah)"],
              ["energy", "Energy (Wh)"],
              ["energyDensity", "Energy density (Wh/kg)"],
              ["chargeRate", "Charge rate (C)"],
              ["dischargeRate", "Discharge rate (C)"],
              ["peakDischargeRate", "Peak discharge (C)"],
            ] as [NumberFieldKey, string][]
          ).map(([k, label]) => (
            <div key={k}>
              <FieldLabel htmlFor={k}>{label}</FieldLabel>
              <TextInput
                id={k}
                type="number"
                value={state[k] as string}
                onChange={(v) => update(k, v)}
                disabled={submitting}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Mechanical & environmental">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(
            [
              ["length", "Length (mm)"],
              ["width", "Width (mm)"],
              ["height", "Height (mm)"],
              ["weight", "Weight (kg)"],
              ["cycleLife", "Cycle life"],
              ["operatingTempMin", "Min temp (°C)"],
              ["operatingTempMax", "Max temp (°C)"],
            ] as [NumberFieldKey, string][]
          ).map(([k, label]) => (
            <div key={k}>
              <FieldLabel htmlFor={k}>{label}</FieldLabel>
              <TextInput
                id={k}
                type="number"
                value={state[k] as string}
                onChange={(v) => update(k, v)}
                disabled={submitting}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Commercial">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="moq">最小起订量</FieldLabel>
            <TextInput
              id="moq"
              type="number"
              value={state.moq}
              onChange={(v) => update("moq", v)}
              disabled={submitting}
            />
          </div>
          <div>
            <FieldLabel htmlFor="leadTime">交期</FieldLabel>
            <TextInput
              id="leadTime"
              value={state.leadTime}
              onChange={(v) => update("leadTime", v)}
              placeholder="例如：2-4 周"
              disabled={submitting}
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <ToggleRow
            id="sampleAvailable"
            label="Samples available"
            checked={state.sampleAvailable}
            onChange={(v) => update("sampleAvailable", v)}
            disabled={submitting}
          />
          <ToggleRow
            id="customizationAvailable"
            label="Customization available"
            checked={state.customizationAvailable}
            onChange={(v) => update("customizationAvailable", v)}
            disabled={submitting}
          />
        </div>
      </Section>

      <Section title="Visibility & ordering">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ToggleRow
            id="published"
            label="Published"
            hint="Visible on the public site when on."
            checked={state.published}
            onChange={(v) => update("published", v)}
            disabled={submitting}
          />
          <ToggleRow
            id="featured"
            label="Featured"
            hint="Promote on the homepage when on."
            checked={state.featured}
            onChange={(v) => update("featured", v)}
            disabled={submitting}
          />
          <div className="md:col-span-2 md:max-w-xs">
            <FieldLabel htmlFor="sortOrder">排序</FieldLabel>
            <TextInput
              id="sortOrder"
              type="number"
              value={state.sortOrder}
              onChange={(v) => update("sortOrder", v)}
              disabled={submitting}
            />
          </div>
        </div>
      </Section>

      {/* Image management placeholder — sub-resource, handled in a later phase. */}
      {mode === "edit" && product?.images && product.images.length > 0 && (
        <Section
          title="Images"
          hint={`${product.images.length} attached`}
        >
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {product.images.map((img) => (
              <li
                key={img.id}
                className="overflow-hidden rounded-md border border-[#E4E4E7] bg-[#FAFAFA]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || img.altEn || ""}
                  className="h-28 w-full object-cover"
                />
                <div className="flex items-center justify-between px-2 py-1.5 text-[10px] text-[#71717A]">
                  <span className="truncate">{img.alt || img.altEn || "—"}</span>
                  {img.isPrimary && (
                    <span className="font-semibold uppercase tracking-wider text-[#2563EB]">
                      Primary
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[#A1A1AA]">
            Reordering, uploading and removing is managed through the products
            sub-resource endpoints in a later phase.
          </p>
        </Section>
      )}

      <div className="flex items-center justify-between border-t border-[#F4F4F5] pt-5">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          disabled={submitting}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#E4E4E7] bg-white px-3 text-sm font-medium text-[#52525B] transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A] disabled:opacity-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          Back
        </button>
        <button
          type="submit"
          disabled={submitting || isPending}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0A0A0A] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#27272A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
              Saving…
            </>
          ) : (
            <>
              {mode === "create" ? "Create product" : "Save changes"}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
