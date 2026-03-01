import AsyncSelect from "react-select/async";

type Option = {
  value: string;
  label: string;
};

type OptionSelectProps = {
  onChange: (option: Option | null) => void;
  value: Option | null;
  placeholder?: string;
  loadOptions: (inputValue: string) => Promise<Option[]>;
  cacheOptions?: boolean;
  defaultOptions?: boolean | Option[];
  instanceId?: string;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
  onChange,
  value,
  placeholder = "",
  loadOptions,
  cacheOptions = true,
  defaultOptions = true,
  instanceId,
}) => {
  return (
    <AsyncSelect
      cacheOptions={cacheOptions}
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      value={value}
      placeholder={placeholder}
      instanceId={instanceId}
      onChange={(option) => onChange(option as Option | null)}
    />
  );
};

export default OptionSelect;
