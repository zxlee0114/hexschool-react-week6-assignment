import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <>
      <h1>404 Not Found</h1>
      <Link to="/">回到首頁</Link>
    </>
  );
}

export default NotFoundPage;
