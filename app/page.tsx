import ValentineScene from "./components/ValentineScene";
import PhotoGallery from "./components/PhotoGallery";
import HeartDraw from "./components/HeartDraw";
import FinalQuestion from "./components/FinalQuestion";

export default function Home() {
  return (
    <main>
      <ValentineScene />
      <PhotoGallery />
      <HeartDraw />
      <FinalQuestion />
    </main>
  );
}
