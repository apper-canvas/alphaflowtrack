import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import invoiceService from "@/services/api/invoiceService";
import projectService from "@/services/api/projectService";
const InvoiceModal = ({ isOpen, onClose, clients, projects, onInvoiceCreated, onInvoiceUpdated, invoice }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    projectId: '',
    dueDate: '',
    items: [{ description: '', amount: 0 }]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [clientProjects, setClientProjects] = useState([]);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState('');
  // Set form data when editing
  React.useEffect(() => {
    if (invoice) {
      setFormData({
        clientId: invoice.clientId_c || '',
        projectId: invoice.projectId_c || '',
        dueDate: invoice.dueDate_c ? new Date(invoice.dueDate_c).toISOString().split('T')[0] : '',
        items: invoice.items_c ? JSON.parse(invoice.items_c) : [{ description: '', amount: 0 }]
      });
    }
  }, [invoice]);
const handleInputChange = async (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // If client is selected, fetch projects for that client
    if (field === 'clientId' && value) {
      setFormData(prev => ({
        ...prev,
        projectId: '' // Clear project selection when client changes
      }));
      setProjectLoading(true);
      setProjectError('');
      
      try {
        const clientProjectsData = await projectService.getByClientId(value);
        setClientProjects(clientProjectsData);
      } catch (error) {
        setProjectError('Failed to load projects for this client');
        setClientProjects([]);
        toast.error('Failed to load projects for selected client');
      } finally {
        setProjectLoading(false);
      }
    } else if (field === 'clientId' && !value) {
      // Clear projects when no client is selected
      setClientProjects([]);
      setFormData(prev => ({
        ...prev,
        projectId: ''
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientId) {
      newErrors.clientId = 'Client is required';
    }
    
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Description is required';
      }
      if (item.amount <= 0) {
        newErrors[`item_${index}_amount`] = 'Amount must be greater than 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const invoiceData = {
        clientId: parseInt(formData.clientId),
        projectId: parseInt(formData.projectId),
        amount: calculateTotal(),
        status: 'Draft',
        dueDate: new Date(formData.dueDate).toISOString(),
        items: formData.items
      };
      
      if (invoice) {
        await invoiceService.update(invoice.Id, invoiceData);
        toast.success('Invoice updated successfully');
        onInvoiceUpdated && onInvoiceUpdated();
      } else {
        await invoiceService.create(invoiceData);
        toast.success('Invoice created successfully');
        onInvoiceCreated && onInvoiceCreated();
      }
      handleClose();
    } catch (error) {
      toast.error(invoice ? 'Failed to update invoice' : 'Failed to create invoice');
      console.error(invoice ? 'Error updating invoice:' : 'Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      clientId: '',
      projectId: '',
      dueDate: '',
      items: [{ description: '', amount: 0 }]
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
    isOpen={isOpen}
    onClose={handleClose}
title={invoice ? "Edit Invoice" : "Create New Invoice"}
    maxWidth="max-w-2xl">
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="clientId">Client *</Label>
                <select
                    id="clientId"
                    value={formData.clientId}
                    onChange={e => handleInputChange("clientId", e.target.value)}
className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                    <option value="">Select a client</option>
                    {clients.map(client => (
                        <option key={client.Id} value={client.Id}>
                            {client.Name} - {client.company_c}
                        </option>
                    ))}
                </select>
                {errors.clientId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.clientId}
                </p>}
            </div>
<div>
                <Label htmlFor="projectId">Project *</Label>
                <select
                    id="projectId"
                    value={formData.projectId}
                    onChange={e => handleInputChange("projectId", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    disabled={!formData.clientId || projectLoading}>
                    <option value="">
                        {projectLoading ? "Loading projects..." : "Select a project"}
                    </option>
                    {clientProjects.map(project => (
                        <option key={project.Id} value={project.Id}>
                            {project.Name}
                        </option>
                    ))}
                </select>
                {errors.projectId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.projectId}
                </p>}
                {projectError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {projectError}
                </p>}
            </div>
        </div>
        <div>
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={e => handleInputChange("dueDate", e.target.value)}
                className="mt-1" />
            {errors.dueDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.dueDate}
            </p>}
        </div>
        <div>
            <div className="flex items-center justify-between mb-4">
                <Label>Line Items *</Label>
<Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Item
                </Button>
            </div>
<div className="space-y-4">
                {formData.items.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex-1">
                        <Label htmlFor={`description_${index}`}>Description</Label>
                        <Input
                            id={`description_${index}`}
                            type="text"
                            value={item.description}
                            onChange={e => handleItemChange(index, "description", e.target.value)}
                            placeholder="Enter item description"
                            className="mt-1" />
                        {errors[`item_${index}_description`] && <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors[`item_${index}_description`]}
                        </p>}
                    </div>
                    <div className="sm:w-32">
                        <Label htmlFor={`amount_${index}`}>Amount</Label>
                        <Input
                            id={`amount_${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.amount}
                            onChange={e => handleItemChange(index, "amount", e.target.value)}
                            placeholder="0.00"
                            className="mt-1" />
                        {errors[`item_${index}_amount`] && <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors[`item_${index}_amount`]}
                        </p>}
                    </div>
                    {formData.items.length > 1 && <div className="flex items-end">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                            <ApperIcon name="Trash2" size={16} />
</Button>
                    </div>}
                    </div>
                ))}
            </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary-600 dark:text-primary-400">${calculateTotal().toFixed(2)}
                </span>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
                type="button"
                variant="outline"
onClick={handleClose}
                className="w-full sm:w-auto">
                Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                    <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        {invoice ? "Updating..." : "Creating..."}
                    </>
                ) : (
                    <>
                        <ApperIcon name={invoice ? "Save" : "Plus"} size={16} className="mr-2" />
                        {invoice ? "Update Invoice" : "Create Invoice"}
                    </>
                )}
            </Button>
        </div>
</form>
    </Modal>
  );
};

const PaymentDateModal = ({ isOpen, onClose, invoice, onConfirm }) => {
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentDate) {
      toast.error('Payment date is required');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(paymentDate);
      onClose();
    } catch (error) {
      toast.error('Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Mark Invoice as Paid"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Mark invoice INV-{String(invoice?.Id).padStart(4, "0")} as paid and record the payment date.
          </p>
          
          <Label htmlFor="paymentDate">Payment Date *</Label>
          <Input
            id="paymentDate"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="mt-1"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <ApperIcon name="DollarSign" size={16} className="mr-2" />
                Mark as Paid
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InvoiceModal;
export { PaymentDateModal };