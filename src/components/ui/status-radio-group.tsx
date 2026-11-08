import styles from "./status-radio-group.module.css";

export function StatusRadioGroup({ label, name, selected, options, disabled }: {
  label: string;
  name: string;
  selected: string;
  options: readonly { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <fieldset className={styles.statusGroup} disabled={disabled}>
      <legend>{label}</legend>
      <div className={styles.statusOptions}>
        {options.map(option => (
          <label key={option.value} className={styles.statusOption}>
            <input type="radio" name={name} value={option.value} defaultChecked={option.value === selected} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
