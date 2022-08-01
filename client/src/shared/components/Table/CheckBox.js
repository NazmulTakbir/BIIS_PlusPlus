import CheckboxSingle from "../CheckboxSingle/CheckboxSingle";

const Checkbox = (props) => {
  //   const { id } = props.data;

  return (
    <td className="text-left">
      <div className="text-block" style={{ margin: "auto", textAlign: "center" }}>
        <CheckboxSingle name="checkbox" width="max-content" />
      </div>
    </td>
  );
};

export default Checkbox;
