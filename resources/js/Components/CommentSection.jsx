import { useEffect } from "react";
import { Card, Button, Avatar } from "antd";
import useAxios from "@/Hooks/useAxios";
import { useForm } from "react-hook-form";
import RenderComments from "./RenderComments";

const CommentSection = ({ product_id }) => {
    const {
        triggerFetch: createComment,
        responseData: successCreateComment,
        finished: finishedCreateComment,
    } = useAxios({
        endpoint: "/api/comment",
        config: {},
        method: "POST",
    });

    const { triggerFetch: fetchComments, responseData: comments } = useAxios({
        endpoint: `/api/comments/${product_id}`,
        config: {},
        method: "GET",
    });

    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        fetchComments?.();
    }, [product_id]);

    useEffect(() => {
        if (successCreateComment && finishedCreateComment) {
            fetchComments?.();
            console.log("Resetting form...");
            reset();
        }
    }, [finishedCreateComment, successCreateComment, reset]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("context", data.context);
        formData.append("product_id", product_id);
        if (data.parent_id) {
            formData.append("parent_id", data.parent_id);
        }
        createComment?.(formData);
    };
    const handleCancelComment = () => {
        reset();
    };

    return (
        <Card className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            {comments?.length > 0 ? (
                <RenderComments
                    refetchComments={fetchComments}
                    createComment={createComment}
                    success={successCreateComment}
                    finished={finishedCreateComment}
                    product_id={product_id}
                    comments={comments}
                />
            ) : (
                <p>No comments yet.</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-4 flex gap-x-4 items-start">
                    <Avatar>U</Avatar>
                    <input
                        rows={2}
                        name="context"
                        {...register("context", {
                            required: "Comment is required",
                        })}
                        onChange={(e) => setValue("context", e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 rounded-md border-gray-300 focus:ring-indigo-500"
                    />
                    {errors.context && (
                        <span className="text-red-500">
                            {errors.context.message}
                        </span>
                    )}
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="ml-2 bg-indigo-600 hover:bg-indigo-500"
                    >
                        Comment
                    </Button>
                    <Button onClick={handleCancelComment} className="ml-2">
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default CommentSection;
