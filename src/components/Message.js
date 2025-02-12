export default function Message({ sender, content }) {
  return (
    <div className="mb-2 p-2 bg-gray-200 rounded-md">
      <strong>{sender}:</strong> {content}
    </div>
  );
}