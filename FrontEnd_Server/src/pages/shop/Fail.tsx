import { useSearchParams } from "react-router-dom";
import NavTop from "../../components/NavTop";
import { Container } from "react-bootstrap";
export function FailPage() {
  const [searchParams] = useSearchParams();

  return (
    <div>
      <NavTop />
      <Container>
      <h1>결제 실패</h1>
      <div>{`사유: ${searchParams.get("message")}`}</div>

      </Container>
    </div>
  );
}
