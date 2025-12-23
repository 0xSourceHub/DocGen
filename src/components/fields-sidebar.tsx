"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  Type,
  Image,
  Hash,
  Calendar,
  Mail,
  Phone,
  Link as LinkIcon,
  Check,
  X,
} from "lucide-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";

// Field type definitions
export type FieldType =
  | "string"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "image"
  | "url";

export interface DynamicField {
  id: string;
  name: string;
  type: FieldType;
  category: string;
  placeholder?: string;
}

const fieldTypeIcons: Record<FieldType, React.ComponentType<{ className?: string }>> = {
  string: Type,
  number: Hash,
  email: Mail,
  phone: Phone,
  date: Calendar,
  image: Image,
  url: LinkIcon,
};

const fieldTypes: { value: FieldType; label: string }[] = [
  { value: "string", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "image", label: "Image" },
  { value: "url", label: "URL" },
];

interface FieldsSidebarProps {
  editorRef: React.RefObject<TinyMCEEditor | null>;
}

export default function FieldsSidebar({ editorRef }: FieldsSidebarProps) {
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["customer", "invoice"]),
  );

  const [newField, setNewField] = useState<Partial<DynamicField>>({
    name: "",
    type: "string",
    category: "customer",
    placeholder: "",
  });

  // Extract fields from editor content
  const extractFieldsFromContent = (content: string): Set<string> => {
    const fieldPattern = /\{\{([^}]+)\}\}/g;
    const matches = content.matchAll(fieldPattern);
    const foundFields = new Set<string>();

    for (const match of matches) {
      const fieldName = match[1]?.trim();
      if (fieldName) {
        foundFields.add(fieldName);
      }
    }

    return foundFields;
  };

  // Sync fields with editor content
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    const syncFields = () => {
      const content = editor.getContent();
      const fieldsInContent = extractFieldsFromContent(content);

      // Remove fields that are no longer in content
      setFields((prevFields) => {
        const updatedFields = prevFields.filter((field) =>
          fieldsInContent.has(field.name),
        );

        // Add new fields found in content
        fieldsInContent.forEach((fieldName) => {
          const exists = updatedFields.some((f) => f.name === fieldName);
          if (!exists) {
            // Determine category from field name (e.g., "customer.name" -> "customer")
            const parts = fieldName.split(".");
            const category = parts.length > 1 ? parts[0] ?? "general" : "general";

            updatedFields.push({
              id: Date.now().toString() + Math.random(),
              name: fieldName,
              type: "string",
              category,
              placeholder: fieldName,
            });
          }
        });

        return updatedFields;
      });
    };

    // Listen to editor changes
    editor.on("change keyup paste", syncFields);

    return () => {
      editor.off("change keyup paste", syncFields);
    };
  }, [editorRef]);

  // Group fields by category
  const groupedFields = fields.reduce(
    (acc, field) => {
      acc[field.category] ??= [];
      acc[field.category]?.push(field);
      return acc;
    },
    {} as Record<string, DynamicField[]>,
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const insertFieldIntoEditor = (field: DynamicField) => {
    if (editorRef.current) {
      const placeholder =
        field.type === "image"
          ? `<img src="{{${field.name}}}" alt="${field.placeholder ?? field.name}" style="max-width: 200px; height: auto;" />`
          : `{{${field.name}}}`;

      editorRef.current.insertContent(placeholder);
      editorRef.current.focus();
    }
  };

  const addField = () => {
    if (newField.name && newField.type && newField.category) {
      const field: DynamicField = {
        id: Date.now().toString(),
        name: newField.name,
        type: newField.type,
        category: newField.category,
        placeholder: newField.placeholder,
      };

      setFields([...fields, field]);

      // Automatically insert into editor
      if (editorRef.current) {
        const placeholder =
          field.type === "image"
            ? `<img src="{{${field.name}}}" alt="${field.placeholder ?? field.name}" style="max-width: 200px; height: auto;" />`
            : `{{${field.name}}}`;
        editorRef.current.insertContent(placeholder + " ");
        editorRef.current.focus();
      }

      setNewField({
        name: "",
        type: "string",
        category: "customer",
        placeholder: "",
      });
      setIsAddingField(false);
    }
  };

  const updateField = (id: string, updates: Partial<DynamicField>) => {
    const field = fields.find((f) => f.id === id);
    if (!field || !editorRef.current) {
      setEditingField(null);
      return;
    }

    // Update field in state
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));

    // Update in editor content if name changed
    if (updates.name && updates.name !== field.name) {
      const content = editorRef.current.getContent();
      const escapedOldName = field.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const oldPattern = new RegExp(`\\{\\{${escapedOldName}\\}\\}`, "g");
      const newContent = content.replace(oldPattern, `{{${updates.name}}}`);
      editorRef.current.setContent(newContent);
    }

    setEditingField(null);
  };

  const deleteField = (id: string) => {
    const field = fields.find((f) => f.id === id);
    if (!field || !editorRef.current) return;

    // Remove from editor content
    const content = editorRef.current.getContent();
    const escapedName = field.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const fieldPattern = new RegExp(`\\{\\{${escapedName}\\}\\}`, "g");
    const imagePattern = new RegExp(
      `<img[^>]*src="\\{\\{${escapedName}\\}\\}"[^>]*>`,
      "g",
    );

    let newContent = content.replace(fieldPattern, "");
    newContent = newContent.replace(imagePattern, "");

    editorRef.current.setContent(newContent);

    // Remove from state
    setFields(fields.filter((f) => f.id !== id));
  };

  return (
    <div className="flex w-80 flex-col border bg-background rounded-r-xl">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg">Dynamic Fields</CardTitle>
        <CardDescription>
          Manage and insert fields into your document
        </CardDescription>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {Object.entries(groupedFields).map(([category, categoryFields]) => {
            const fieldsArray = categoryFields ?? [];
            return (
              <Card key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center justify-between p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">
                      {category}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {fieldsArray.length}
                    </Badge>
                  </div>
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {expandedCategories.has(category) && (
                  <CardContent className="space-y-1 p-0">
                    {fieldsArray.map((field) => {
                      const Icon = fieldTypeIcons[field.type];
                      const isEditing = editingField === field.id;

                      return (
                        <div
                          key={field.id}
                          className="border-t p-3 transition-colors hover:bg-accent/50"
                        >
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <Label htmlFor={`field-name-${field.id}`} className="text-xs">
                                  Field Name
                                </Label>
                                <Input
                                  id={`field-name-${field.id}`}
                                  type="text"
                                  value={field.name}
                                  onChange={(e) =>
                                    setFields(
                                      fields.map((f) =>
                                        f.id === field.id
                                          ? { ...f, name: e.target.value }
                                          : f,
                                      ),
                                    )
                                  }
                                  placeholder="field.name"
                                  className="h-8"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor={`field-type-${field.id}`} className="text-xs">
                                  Field Type
                                </Label>
                                <Select
                                  value={field.type}
                                  onValueChange={(value: FieldType) =>
                                    setFields(
                                      fields.map((f) =>
                                        f.id === field.id
                                          ? { ...f, type: value }
                                          : f,
                                      ),
                                    )
                                  }
                                >
                                  <SelectTrigger id={`field-type-${field.id}`} className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fieldTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor={`field-placeholder-${field.id}`} className="text-xs">
                                  Placeholder
                                </Label>
                                <Input
                                  id={`field-placeholder-${field.id}`}
                                  type="text"
                                  value={field.placeholder ?? ""}
                                  onChange={(e) =>
                                    setFields(
                                      fields.map((f) =>
                                        f.id === field.id
                                          ? { ...f, placeholder: e.target.value }
                                          : f,
                                      ),
                                    )
                                  }
                                  placeholder="Placeholder text"
                                  className="h-8"
                                />
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateField(field.id, {
                                      name: field.name,
                                      type: field.type,
                                      placeholder: field.placeholder,
                                    })
                                  }
                                  className="flex-1"
                                >
                                  <Check className="mr-1 h-3 w-3" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingField(null)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <button
                                onClick={() => insertFieldIntoEditor(field)}
                                className="group flex flex-1 items-center gap-2 text-left"
                              >
                                <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                                    {field.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {
                                      fieldTypes.find((t) => t.value === field.type)
                                        ?.label
                                    }
                                  </div>
                                </div>
                              </button>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingField(field.id)}
                                  className="h-7 w-7"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => deleteField(field.id)}
                                  className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                )}
              </Card>
            );
          })}

          {Object.keys(groupedFields).length === 0 && !isAddingField && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No fields yet. Add your first field to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        {isAddingField ? (
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-field-name" className="text-xs">
                  Field Name
                </Label>
                <Input
                  id="new-field-name"
                  type="text"
                  value={newField.name ?? ""}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                  placeholder="customer.name"
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-field-category" className="text-xs">
                  Category
                </Label>
                <Input
                  id="new-field-category"
                  type="text"
                  value={newField.category ?? ""}
                  onChange={(e) =>
                    setNewField({ ...newField, category: e.target.value })
                  }
                  placeholder="customer"
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-field-type" className="text-xs">
                  Field Type
                </Label>
                <Select
                  value={newField.type ?? "string"}
                  onValueChange={(value: FieldType) =>
                    setNewField({ ...newField, type: value })
                  }
                >
                  <SelectTrigger id="new-field-type" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-field-placeholder" className="text-xs">
                  Placeholder
                </Label>
                <Input
                  id="new-field-placeholder"
                  type="text"
                  value={newField.placeholder ?? ""}
                  onChange={(e) =>
                    setNewField({ ...newField, placeholder: e.target.value })
                  }
                  placeholder="Optional"
                  className="h-9"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addField} className="flex-1">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Field
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingField(false);
                    setNewField({
                      name: "",
                      type: "string",
                      category: "customer",
                      placeholder: "",
                    });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setIsAddingField(true)}
            className="w-full"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Field
          </Button>
        )}
      </div>
    </div>
  );
}