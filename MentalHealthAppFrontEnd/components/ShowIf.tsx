interface ShowIfProps {
  condition: boolean;
  render: () => JSX.Element;
  renderElse?: () => JSX.Element;
}

const ShowIf: React.FC<ShowIfProps> = ({ condition, render, renderElse }) => {
  if (condition) {
    return <>{render()}</>;
  }
  if (renderElse) {
    return <>{renderElse()}</>;
  }
  return null;
};

export default ShowIf;
