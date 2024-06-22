type Props = {
  title: string;
  onClick: () => void;
  widthFull?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

function PrimaryButton({
  title,
  onClick,
  widthFull = false,
  disabled,
  loading,
  className = "",
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled ?? loading}
      style={styles}
    >
      {loading ? <>Loading...😶‍🌫️</> : title}
    </button>
  );
}

const styles = {
  color: ''
}

export default PrimaryButton;
