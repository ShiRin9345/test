import Image from "next/image";

// 强制动态渲染，避免构建时获取数据
// 明确告诉 Next.js 这个路由完全在运行时生成，不在构建时预渲染
export const dynamic = "force-dynamic";
export const revalidate = 0; // 禁用静态生成和缓存

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

async function getProducts(): Promise<Product[]> {
  try {
    // 在 force-dynamic 模式下，fetch 默认就是动态的
    // 不需要额外的 cache 配置，让 Next.js 在运行时获取数据
    const res = await fetch("https://fakestoreapi.com/products", {
      // 不设置任何缓存选项，在 force-dynamic 模式下会自动在运行时获取
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch products: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    // 返回空数组而不是抛出错误，这样页面仍然可以渲染
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-black dark:text-zinc-50">
          产品列表
        </h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              暂无产品数据
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative h-64 w-full bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
                    {product.title.length > 50
                      ? `${product.title.substring(0, 50)}...`
                      : product.title}
                  </h2>
                  <p className="mb-3 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-bold text-black dark:text-zinc-50">
                      ${product.price}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-yellow-500">★</span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {product.rating.rate} ({product.rating.count})
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
