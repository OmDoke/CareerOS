import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useUpdateResume } from "../hooks/useResume";
import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Use textarea for multiline data like Experience and Projects
// but shadcn only generated input. I will just use native textarea for now, or just basic inputs.
// I'll create a simple textarea styling similar to shadcn input.
const textareaClasses = "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  skills: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  projects: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  initialData: FormValues;
}

export function ResumeInfoForm({ initialData }: Props) {
  const updateResume = useUpdateResume();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const onSubmit = (data: FormValues) => {
    setMsg(null);
    updateResume.mutate(data, {
      onSuccess: () => {
        setMsg({ type: "success", text: "Resume details saved successfully!" });
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        setMsg({ type: "error", text: err.response?.data?.message || "Failed to save details" });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {msg && (
        <div className={`p-3 rounded-md flex items-center gap-2 text-sm ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {msg.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register("name")} placeholder="John Doe" />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} placeholder="+1 234 567 890" />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="education">Education</Label>
          <Input id="education" {...register("education")} placeholder="B.S. Computer Science" />
          {errors.education && <p className="text-sm text-red-500">{errors.education.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <textarea 
          id="skills" 
          className={textareaClasses} 
          {...register("skills")} 
          placeholder="React, Node.js, TypeScript..." 
        />
        {errors.skills && <p className="text-sm text-red-500">{errors.skills.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Experience</Label>
        <textarea 
          id="experience" 
          className={textareaClasses} 
          {...register("experience")} 
          placeholder="Software Engineer at Tech Corp..." 
        />
        {errors.experience && <p className="text-sm text-red-500">{errors.experience.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="projects">Projects</Label>
        <textarea 
          id="projects" 
          className={textareaClasses} 
          {...register("projects")} 
          placeholder="E-commerce Platform..." 
        />
        {errors.projects && <p className="text-sm text-red-500">{errors.projects.message}</p>}
      </div>

      <Button type="submit" disabled={updateResume.isPending} className="w-full">
        {updateResume.isPending ? "Saving..." : "Save Details"}
      </Button>
    </form>
  );
}
