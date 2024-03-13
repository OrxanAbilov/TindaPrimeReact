export const getStatusLabel = (statusId) => {
    switch (statusId) {
      case 1:
        return "İlkin qeydiyyat";
      case 2:
        return "Növbədə";
      case 3:
        return "Gözləmədə";
      case 4:
        return "Təsdiqləndi";
      case 5:
        return "Icra gözləyir";
      case 6:
        return "Tamamlandı";
      case 7:
        return "Ləğv edildi";
      default:
        return "Imtina edildi";
    }
  };

  export const getStatusSeverity = (statusId) => {
    switch (statusId) {
      case 4:
      case 6:
        return "success";

      case 1:
        return "warning";

      case 7:
      case 8:
        return "danger";

      default:
        return "info";
    }
  };