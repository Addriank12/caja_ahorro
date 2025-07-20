import { type ReactNode } from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  children: ReactNode;
  className?: string;
}

export const Alert = ({ type, children, className = "" }: AlertProps) => {
  const config = {
    success: {
      icon: CheckCircle,
      classes: "bg-green-50 border-green-200 text-green-800",
    },
    error: {
      icon: XCircle,
      classes: "bg-red-50 border-red-200 text-red-800",
    },
    warning: {
      icon: AlertCircle,
      classes: "bg-yellow-50 border-yellow-200 text-yellow-800",
    },
    info: {
      icon: Info,
      classes: "bg-blue-50 border-blue-200 text-blue-800",
    },
  };

  const { icon: Icon, classes } = config[type];

  return (
    <div
      className={`flex items-center p-4 rounded-md border ${classes} ${className}`}
    >
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <div className="text-sm">{children}</div>
    </div>
  );
};
