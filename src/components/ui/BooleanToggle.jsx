const BooleanToggle = ({
  value,
  onChange,
  trueLabel = "Yes",
  falseLabel = "No",
}) => {
  const base =
    "flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30";
  const active = "bg-brand text-white shadow-sm";
  const inactive =
    "border border-hairline bg-canvas text-zinc-700 hover:border-brand/30 hover:text-brand dark:text-neutral-300";

  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-pressed={Boolean(value)}
        onClick={() => onChange(true)}
        className={[base, value ? active : inactive].join(" ")}
      >
        {trueLabel}
      </button>
      <button
        type="button"
        aria-pressed={!value}
        onClick={() => onChange(false)}
        className={[base, !value ? active : inactive].join(" ")}
      >
        {falseLabel}
      </button>
    </div>
  );
};

export default BooleanToggle;
