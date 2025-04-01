import Container from "@/components/UI/container";

function SkeletonCard() {
  return (
    <Container className="min-w-44 w-44 h-64 overflow-hidden skeleton">
      <div className="w-full h-52 bg-zinc-200"></div>
      <div className="p-2">
        <div className="bg-zinc-100 h-2 mb-2 rounded-full"></div>
        <div className="bg-zinc-100 h-2 rounded-full"></div>
      </div>
    </Container>
  );
}

export default SkeletonCard;
