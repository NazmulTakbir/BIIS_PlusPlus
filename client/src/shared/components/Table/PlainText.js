const PlainText = (props) => {
  const { value } = props.data;

  return (
    <td className="text-left">
      <div className="text-block">{value}</div>
    </td>
  );
};

export default PlainText;
