import CheckboxSingle from "../CheckboxSingle/CheckboxSingle";

const Checkbox = (props) => {
  const { id, callback, custom_checked } = props.data;

  let provided_check_state;
  if (custom_checked === undefined || custom_checked === false) {
    provided_check_state = false;
  } else {
    provided_check_state = true;
  }

  return (
    <td className="text-left">
      <div className="text-block" style={{ margin: "auto", textAlign: "center" }}>
        <CheckboxSingle
          name="checkbox"
          width="max-content"
          id={id}
          callback={callback}
          custom_checked={provided_check_state}
        />
      </div>
    </td>
  );
};

export default Checkbox;
