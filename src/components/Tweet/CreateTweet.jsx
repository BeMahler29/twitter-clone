import { postTweet } from "../../firebaseFunctions/tweets";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

export default function CreateTweet({ currentUser, onPosted }) {
  // Variable
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Function
  const onSubmit = async ({ content }) => {
    try {
      await postTweet(currentUser.uid, content);
      toast.success("Tweet posté !");
      reset();
      if (onPosted) onPosted();
    } catch (error) {
      toast.error(
        "Une erreur s'est produite pendant la publication :" + error.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <textarea
        {...register("content", {
          required: "Tweet vide ?",
          maxLength: { value: 280, message: "280 caractères max !" },
        })}
        className="w-full border rounded p-2 text-gray-800"
        rows={3}
        placeholder="Quoi de neuf ?"
      />
      {errors.content && (
        <p className="text-red-500 text-sm">{errors.content.message}</p>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-2"
        type="submit"
      >
        Poster
      </button>
    </form>
  );
}
