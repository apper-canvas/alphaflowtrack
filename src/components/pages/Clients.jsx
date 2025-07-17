import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ClientTable from "@/components/organisms/ClientTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import clientService from "@/services/api/clientService";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      setError(err.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleEdit = (client) => {
    toast.info(`Edit client: ${client.name}`);
  };

  const handleDelete = async (client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      try {
        await clientService.delete(client.Id);
        setClients(prev => prev.filter(c => c.Id !== client.Id));
        toast.success("Client deleted successfully");
      } catch (err) {
        toast.error("Failed to delete client");
      }
    }
  };

  const handleAddClient = () => {
    toast.info("Add new client functionality");
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClients} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Clients</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your client relationships and contacts
          </p>
        </div>
        <Button onClick={handleAddClient} className="w-full sm:w-auto">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search clients by name, email, or company..."
          className="max-w-md"
        />
      </motion.div>

      {filteredClients.length === 0 ? (
        <Empty
          icon="Users"
          title="No clients found"
          description={
            searchTerm
              ? "No clients match your search criteria. Try adjusting your search terms."
              : "Start building your client base by adding your first client."
          }
          actionLabel="Add Client"
          onAction={handleAddClient}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ClientTable
            clients={filteredClients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Clients;