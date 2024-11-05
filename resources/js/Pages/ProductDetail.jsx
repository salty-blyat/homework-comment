import { useEffect } from "react";
import { Card } from "antd";
import useAxios from "@/Hooks/useAxios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import CommentSection from "@/Components/CommentSection";

const ProductDetail = ({ slug }) => {
    const { triggerFetch: fetchProduct, responseData: product } = useAxios({
        endpoint: `/api/product/${slug}`,
        config: {},
        method: "GET",
    });

    useEffect(() => {
        fetchProduct?.();
    }, [slug]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Product Detail
                </h2>
            }
        >
            <Head title="Product detail" />
            <div className="p-6">
                {/* Product Details Card */}
                <Card className="mb-4">
                    {product ? (
                        <div className="flex flex-col md:flex-row items-center">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full md:w-1/2 h-48 object-cover rounded-md"
                            />
                            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                                <h1 className="text-2xl font-bold">
                                    {product.name}
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    {product.description}
                                </p>
                                <p className="text-lg font-semibold text-green-500 mt-4">
                                    ${product.price}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Card>
                {/* Comments Section */}
                <CommentSection product_id={slug} />
            </div>
        </AuthenticatedLayout>
    );
};

export default ProductDetail;
