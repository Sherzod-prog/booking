import { Link } from "react-router-dom";
import Container from "../components/ui/Container";

export default function NotFoundPage() {
    return (
        <section className="py-16">
            <Container className="text-center">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="mt-3 text-slate-600">Page not found</p>
                <Link
                    to="/"
                    className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                >
                    Go home
                </Link>
            </Container>
        </section>
    );
}