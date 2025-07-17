import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import InvoiceTable from "@/components/organisms/InvoiceTable";
import InvoiceModal from "@/components/organisms/InvoiceModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import invoiceService from "@/services/api/invoiceService";
import clientService from "@/services/api/clientService";
import projectService from "@/services/api/projectService";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [invoicesData, clientsData, projectsData] = await Promise.all([
        invoiceService.getAll(),
        clientService.getAll(),
        projectService.getAll()
      ]);
      setInvoices(invoicesData);
      setClients(clientsData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (invoice) => {
    toast.info(`Edit invoice: INV-${String(invoice.Id).padStart(4, "0")}`);
  };

  const handleDelete = async (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice INV-${String(invoice.Id).padStart(4, "0")}?`)) {
      try {
        await invoiceService.delete(invoice.Id);
        setInvoices(prev => prev.filter(i => i.Id !== invoice.Id));
        toast.success("Invoice deleted successfully");
      } catch (err) {
        toast.error("Failed to delete invoice");
      }
    }
  };

const handleCreateInvoice = () => {
    setShowCreateModal(true);
  };

  const handleInvoiceCreated = () => {
    loadData();
  };

  const filteredInvoices = invoices.filter(invoice => {
    const client = clients.find(c => c.Id === invoice.clientId);
    const project = projects.find(p => p.Id === invoice.projectId);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      String(invoice.Id).padStart(4, "0").includes(searchLower) ||
      invoice.status.toLowerCase().includes(searchLower) ||
      client?.name.toLowerCase().includes(searchLower) ||
      project?.name.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Invoices</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage billing and track payment status for your projects
          </p>
        </div>
<Button onClick={handleCreateInvoice} className="w-full sm:w-auto">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Invoice
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
          placeholder="Search by invoice number, client, project, or status..."
          className="max-w-md"
        />
      </motion.div>

      {filteredInvoices.length === 0 ? (
        <Empty
          icon="FileText"
          title="No invoices found"
          description={
            searchTerm
              ? "No invoices match your search criteria. Try adjusting your search terms."
              : "Start billing your clients by creating your first invoice."
          }
          actionLabel="Create Invoice"
          onAction={handleCreateInvoice}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InvoiceTable
            invoices={filteredInvoices}
            clients={clients}
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
</motion.div>
      )}

      <InvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        clients={clients}
        projects={projects}
        onInvoiceCreated={handleInvoiceCreated}
      />
    </div>
  );
};

export default Invoices;