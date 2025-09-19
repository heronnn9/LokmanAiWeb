import { IMessageDetail } from '@/@interfaces/models/message';
import IconButton from '@/components/shared/ui/Button/IconButton';
import PrimaryButton from '@/components/shared/ui/Button/PrimaryButton';
import Icon from '@/components/ui/Icon';
import TextArea from '@/components/ui/Input/TextArea/TextArea';
import { messageApi, useCreateMessageMutation } from '@/services/messageApi';
import { useAppDispatch } from '@/store/hooks';
import { createFilePreview } from '@/utils/createFilePreview';
import Image from 'next/image';
import React, { useState } from 'react';

interface FilePreview {
    file: File;
    preview: string;
    id: string;
}

const MessageInput = ({
    sellerCustomerId,
    scrollToBottom,
}: {
    sellerCustomerId: string;
    scrollToBottom: () => void;
}) => {
    const [message, setMessage] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
    const [createMessage] = useCreateMessageMutation();
    //const { show } = useToast();
    const dispatch = useAppDispatch();

    const handleSendMessage = async (message: string) => {
        if (message.trim() === '' && files.length === 0) return;

        const tempId = Date.now();

        // Create optimistic message detail with loading state
        const optimisticMessageDetail = {
            messageDetailId: tempId,
            messageId: 0,
            senderCustomerUserId: '',
            recipientCustomerUserId: sellerCustomerId,
            messageBody: message,
            isRead: false,
            readDate: null,
            isMyMessage: true,
            isLoading: true,
            messageDocuments: files
                .map((file, index) => {
                    const filePreview = filePreviews.find(
                        (preview) => preview.file === file
                    );
                    const isImageFile = file.type.startsWith('image/');
                    if (isImageFile && filePreview?.preview) {
                        return {
                            messageDetailDocumentId: tempId + index,
                            messageDetailId: tempId,
                            documentName: file.name,
                            documentPath: filePreview.preview,
                            isTemporary: true,
                        };
                    } else {
                        // For non-image files, create a Blob URL
                        const blobUrl = URL.createObjectURL(file);
                        return {
                            messageDetailDocumentId: tempId + index,
                            messageDetailId: tempId,
                            documentName: file.name,
                            documentPath: blobUrl,
                            isTemporary: true,
                        };
                    }
                })
                .filter(Boolean),
        } as IMessageDetail;

        // Immediately add optimistic message to cache
        dispatch(
            messageApi.util.updateQueryData(
                'getMessageById',
                { sellerCustomerId },
                (draft) => {
                    if (draft && draft.messageDetails) {
                        draft.messageDetails.push(optimisticMessageDetail);
                    }
                }
            )
        );

        // Clear form immediately
        setMessage('');
        setFiles([]);
        setFilePreviews([]);
        scrollToBottom();

        try {
            const result = await createMessage({
                body: message,
                sellerCustomerId,
                files,
            }).unwrap();

            // Update the optimistic message with success state
            dispatch(
                messageApi.util.updateQueryData(
                    'getMessageById',
                    { sellerCustomerId },
                    (draft) => {
                        if (draft && draft.messageDetails) {
                            const messageIndex = draft.messageDetails.findIndex(
                                (msg) => msg.messageDetailId === tempId
                            );
                            if (messageIndex !== -1) {
                                draft.messageDetails[messageIndex] = {
                                    ...draft.messageDetails[messageIndex],
                                    messageId: result.messageId,
                                    isLoading: false,
                                } as IMessageDetail;
                            }
                        }
                    }
                )
            );

            // Also invalidate the messages list to update unread counts and last message
            dispatch(
                messageApi.util.invalidateTags([
                    { type: 'Message', id: 'LIST' },
                ])
            );

            /*  show({
                message: 'Mesaj gönderildi',
                type: 'success',
            }); */
        } catch (error) {
            console.error(error);

            // Update the optimistic message with error state
            dispatch(
                messageApi.util.updateQueryData(
                    'getMessageById',
                    { sellerCustomerId },
                    (draft) => {
                        if (draft && draft.messageDetails) {
                            const messageIndex = draft.messageDetails.findIndex(
                                (msg) => msg.messageDetailId === tempId
                            );
                            if (messageIndex !== -1) {
                                draft.messageDetails[messageIndex] = {
                                    ...draft.messageDetails[messageIndex],
                                    isLoading: false,
                                    error: 'Mesaj gönderilemedi',
                                } as IMessageDetail;
                            }
                        }
                    }
                )
            );
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length > 0) {
            const newFiles = [...files, ...selectedFiles];
            setFiles(newFiles);

            // Create previews for new files
            const newPreviews = await Promise.all(
                selectedFiles.map(createFilePreview)
            );
            setFilePreviews([...filePreviews, ...newPreviews]);
            /*  if (message.trim() === '') {
                setMessage(newFiles.map((file) => file.name).join(', '));
            } */
        }
    };

    const removeFile = (id: string) => {
        const previewToRemove = filePreviews.find(
            (preview) => preview.id === id
        );
        if (previewToRemove) {
            setFiles(files.filter((file) => file !== previewToRemove.file));
            setFilePreviews(
                filePreviews.filter((preview) => preview.id !== id)
            );
        }
    };

    const getFileExtension = (fileName: string) => {
        return fileName.split('.').pop()?.toUpperCase() || 'FILE';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(message);
        }
    };

    return (
        <div className="relative w-full">
            {/* File Preview Area */}
            {filePreviews.length > 0 && (
                <div className="absolute -top-20 left-0 flex flex-wrap gap-2 rounded-lg bg-gray-50 px-3">
                    {filePreviews.map((filePreview) => (
                        <div
                            key={filePreview.id}
                            className="relative flex h-20 w-20 items-center justify-center rounded-lg border bg-white shadow-sm"
                        >
                            {filePreview.file.type.startsWith('image/') ? (
                                <Image
                                    src={filePreview.preview}
                                    alt={filePreview.file.name}
                                    width={80}
                                    height={80}
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <Icon
                                        icon="attach"
                                        className="dark:brightness-0 dark:invert"
                                        size={24}
                                        color="#6b7280"
                                    />
                                    <span className="mt-1 text-xs text-gray-600">
                                        {getFileExtension(
                                            filePreview.file.name
                                        )}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={() => removeFile(filePreview.id)}
                                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                title={`Remove ${filePreview.file.name}`}
                            >
                                <Icon
                                    icon="x"
                                    className="dark:brightness-0 dark:invert"
                                    size={12}
                                    color="#ffffff"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Message Input Area */}
            <div className="relative h-48 w-full lg:h-20">
                <div className="absolute inset-0">
                    <TextArea
                        placeholder="Mesajınızı yazınız"
                        id="message-input"
                        className="!h-48 !resize-none md:!pr-72 lg:!h-20"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="absolute right-4 flex w-[256px] items-center gap-2 max-lg:bottom-2 lg:top-6">
                        <PrimaryButton
                            isLight
                            size="base"
                            fullWidth
                            onClick={() => handleSendMessage(message)}
                        >
                            Gönder
                        </PrimaryButton>
                        <div className="w-fit">
                            <IconButton
                                iconType="attach"
                                iconSize={20}
                                customClassName="!w-12 !h-12"
                                onClick={() => {
                                    const input =
                                        document.createElement('input');
                                    input.type = 'file';
                                    input.multiple = true;
                                    input.onchange = (e) => {
                                        if (
                                            e.target instanceof HTMLInputElement
                                        ) {
                                            handleFileChange({
                                                target: e.target,
                                            } as React.ChangeEvent<HTMLInputElement>);
                                        }
                                    };
                                    input.click();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;
