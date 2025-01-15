import Container from "@/components/UI/container";

function SkeletonCard() {
  return (
    <Container className="w-44 overflow-hidden">
      <div className="w-full h-44 bg-zinc-300"></div>
      <div className="p-2">
        <div className="bg-zinc-300 h-3 mb-2 rounded-full"></div>
        <div className="bg-zinc-300 h-3 rounded-full"></div>
      </div>
    </Container>
  );
}

export default SkeletonCard;
