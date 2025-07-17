import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ClientTable = ({ clients, onEdit, onDelete }) => {
  if (!clients || clients.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 dark:border-slate-700/50">
              <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Client
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Company
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Contact
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Joined
              </th>
              <th className="text-right p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <motion.tr
                key={client.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-white/5 dark:border-slate-700/30 hover:bg-white/5 dark:hover:bg-slate-700/20 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-sm">
                        {client.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {client.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {client.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {client.company}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-slate-700 dark:text-slate-300">
                    {client.phone}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-slate-700 dark:text-slate-300">
                    {format(new Date(client.createdAt), "MMM dd, yyyy")}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit && onEdit(client)}
                    >
                      <ApperIcon name="Edit2" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete && onDelete(client)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;