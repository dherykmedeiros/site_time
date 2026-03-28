import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-6xl">🔍</div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        Página não encontrada
      </h2>
      <p className="mb-6 text-gray-600">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
