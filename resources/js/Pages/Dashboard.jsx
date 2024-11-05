import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import useAxios from "@/Hooks/useAxios";
import { useEffect, useState } from "react";
import Product from "@/Components/Product";

export default function Dashboard() {
    const {
        triggerFetch: fetchProducts,
        responseData: products,
        error,
        finished,
    } = useAxios({
        endpoint: "/api/products",
        config: {},
        method: "GET",
    });
    useEffect(() => {
        fetchProducts?.();
    }, []); 
      
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-grow overflow-hidden  gap-x-4 shadow-sm sm:rounded-lg   p-6  ">
                        {products?.map((p) => (
                            <Link key={p?.id}
                                className="min-w-28 min-h-9"
                                href={`product/${p?.id}`}
                            >
                                <Product  product={p} />
                            </Link>
                        ))}
                    </div> 
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
