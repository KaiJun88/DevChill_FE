export const getLifecycleStatus = (status) => {
  switch (status) {
    case "upcoming":
      return {
        label: "Sắp chiếu",
        color: "bg-yellow-500",
      };
    case "ongoing":
      return {
        label: "Đang chiếu",
        color: "bg-green-500",
      };
    case "completed":
      return {
        label: "Hoàn thành",
        color: "bg-gray-500",
      };
    default:
      return {
        label: "Không rõ",
        color: "bg-gray-400",
      };
  }
};
