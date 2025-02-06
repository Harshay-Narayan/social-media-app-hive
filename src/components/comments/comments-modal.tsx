import Comments from "./comments";

function CommentsModal({
  toggleShowCommentHandler,
  postId,
}: {
  toggleShowCommentHandler: () => void;
  postId: string;
}) {
  return (
    <div
      className="fixed z-[1000] inset-0 bg-white/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          toggleShowCommentHandler();
        }
      }}
    >
      <Comments
        toggleShowCommentHandler={toggleShowCommentHandler}
        postId={postId}
      />
    </div>
  );
}

export default CommentsModal;
