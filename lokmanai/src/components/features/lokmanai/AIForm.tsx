import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/Input/TextArea/TextArea";
import { Message } from "@/store/slices/chatSlice";
import classNames from "classnames";
import React from "react";

const AIForm = ({ handleSubmit, question, setQuestion, loading, messages }: { handleSubmit: (e: React.FormEvent) => void, question: string, setQuestion: (question: string) => void, loading: boolean, messages?: Message[] }) => {
  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end  ">
      <div className="flex-1">
        <TextArea
          id="question"
          placeholder="Mesajınızı yazın..."
          value={question}
          className={classNames("h-20 resize-none", messages?.length === 0 && "!rounded-full !h-12 !py-3 ")}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>

      <Button
        type="submit"
        isLoading={loading}
        disabled={loading || !question.trim()}
        size={messages?.length === 0 ? "sm" : "base"}
        className={"h-20 px-6"}
      >
        {loading ? "..." : "Gönder"}
      </Button>
    </form>
  );
};

export default AIForm;
