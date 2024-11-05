import useAxios from "@/Hooks/useAxios";
import { Comment } from "@ant-design/compatible";
import { Avatar, Button, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const RenderReplies = ({
    refetchComments, 
    comments = [],
    product_id, 
}) => {
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);


    const {
        triggerFetch: createComment,
        responseData: success,
        finished: finished,
    } = useAxios({
        endpoint: "/api/comment",
        config: {},
        method: "POST",
    });

    const {
        triggerFetch: editComment,
        responseData: successEditComment,
        finished: finishedEditComment,
    } = useAxios({
        endpoint: `/api/comment/update/${editingCommentId}`,
        config: {},
        method: "POST",
    });

    const {
        triggerFetch: deleteComment,
        responseData: successDeleteComment,
        error: deleteError,
        finished: finishedDeleteComment,
    } = useAxios({
        endpoint: "/api/comment/delete",
        config: {},
        method: "POST",
    });

    const { register, setValue, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (deleteError && finishedDeleteComment) {
            setConfirmLoading(false);
            setModalOpen(false);
            message.error("Failed to delete comment. Please try again.");
        }
    }, [deleteError, finishedDeleteComment]);

    useEffect(() => {
        if (successEditComment && finishedEditComment) {
            refetchComments();
            setConfirmLoading(false);
            setEditingCommentId(null);
            setReplyingTo(null);
            message.success("Comment delete successfully.");
            reset();
        }
    }, [successEditComment, finishedEditComment, reset]);

    useEffect(() => {
        if (success && finished) {
            refetchComments();
            setReplyingTo(null);
            reset();
        }
    }, [success, finished]);

    useEffect(() => {
        if (successDeleteComment && finishedDeleteComment) {
            refetchComments();
            setConfirmLoading(false);
            setModalOpen(false);
            setCommentToDelete(null);
            reset();
        }
    }, [successDeleteComment, finishedDeleteComment]);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("context", data.context);
        formData.append("product_id", product_id);
        if (replyingTo) {
            formData.append("parent_id", replyingTo);
        }
        createComment?.(formData);
        reset();
    };

    const onEdit = (data) => {
        const formData = new FormData();
        formData.append("context", data.context);
        editComment(formData);
        setEditingCommentId(null);
        reset();
    };

    const showDeleteModal = (commentId) => {
        setCommentToDelete(commentId);
        setModalOpen(true);
    };

    const handleDelete = () => {
        if (commentToDelete) {
            setConfirmLoading(true);
            const formData = new FormData();
            formData.append("id", commentToDelete);
            deleteComment?.(formData);
        }
    };
    console.log(comments);

    return (
        <>
            {/* {comments?.length > 0 ? (
                comments?.map((comment) => (
                    <div key={comment?.id} className="mb-6">
                        <Comment
                            author={
                                <div className="flex justify-between w-full font-medium text-gray-800">
                                    <span>{comment?.name}</span>
                                    <span>{comment?.commented_at}</span>
                                </div>
                            }
                            avatar={<Avatar>{comment?.name[0]}</Avatar>}
                            content={
                                editingCommentId === comment?.id ? (
                                    <form onSubmit={handleSubmit(onEdit)}>
                                        <input
                                            {...register("context")}
                                            type="text"
                                            defaultValue={comment?.context}
                                            onChange={(e) =>
                                                setValue(
                                                    "context",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-2 border rounded"
                                        />
                                        <Button
                                            onClick={() =>
                                                setEditingCommentId(null)
                                            }
                                            className="mt-2 mr-2"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            htmlType="submit"
                                            className="mt-2"
                                        >
                                            Submit
                                        </Button>
                                    </form>
                                ) : (
                                    <p>{comment?.context}</p>
                                )
                            }
                            actions={[
                                <Button
                                    key="reply"
                                    type="link"
                                    onClick={() => setReplyingTo(comment?.id)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Reply
                                </Button>,
                                comment?.can_edit && (
                                    <Button
                                        key="edit"
                                        type="link"
                                        onClick={() =>
                                            setEditingCommentId(comment?.id)
                                        }
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        Edit
                                    </Button>
                                ),
                                comment?.can_delete && (
                                    <Button
                                        key="delete"
                                        type="link"
                                        onClick={() =>
                                            showDeleteModal(comment?.id)
                                        }
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        Delete
                                    </Button>
                                ),
                            ]}
                        />
                        
                        {replyingTo === comment?.id && (
                            <div className="ml-8 pl-4 border-l-2 border-gray-200">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mt-2 flex items-start">
                                        <Avatar className="mr-4">U</Avatar>
                                        <input
                                            {...register("context")}
                                            placeholder="Add a reply..."
                                            className="flex-1 rounded-md border-gray-300 focus:ring-indigo-500 p-2"
                                        />
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="ml-2 bg-indigo-600 hover:bg-indigo-500"
                                        >
                                            Reply
                                        </Button>
                                        <Button
                                            type="default"
                                            onClick={() => setReplyingTo(null)}
                                            className="ml-2"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No comments yet</p>
            )} */}

            <Modal
                title="Are you sure you want to delete?"
                open={modalOpen}
                onOk={handleDelete}
                confirmLoading={confirmLoading}
                onCancel={() => {
                    setModalOpen(false);
                    setCommentToDelete(null);
                    setConfirmLoading(false);
                }}
            >
                <p>You cannot undo this action.</p>
            </Modal>
        </>
    );
};

export default RenderReplies;
