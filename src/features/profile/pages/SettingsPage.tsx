import React from "react";
import { useMe } from "@/features/profile/hooks/userHooks";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Database, 
  ChevronRight,
  Mail,
  Lock,
  Eye,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <Skeleton className="h-16 w-full rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-[2.5rem]" />
            <Skeleton className="h-48 w-full rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">System Error</h3>
        <p className="text-lg text-gray-500 max-w-xs mb-8">We encountered an issue while loading your preferences.</p>
        <Button onClick={() => window.location.reload()} className="h-12 px-8 rounded-xl font-black bg-gray-900 text-white">
          Reload System
        </Button>
      </div>
    );
  }

  const sections = [
    {
      id: "account",
      title: "Account Security",
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      description: "Manage your credentials and authentication methods.",
      items: [
        { label: "Email Address", value: user.email, icon: <Mail className="w-4 h-4" />, disabled: true },
        { label: "Password", value: "••••••••••••", icon: <Lock className="w-4 h-4" />, disabled: true },
      ]
    },
    {
      id: "profile",
      title: "Public Presence",
      icon: <User className="w-5 h-5 text-purple-600" />,
      description: "Control how others see your professional brand.",
      items: [
        { label: "Profile Visibility", value: "Public", icon: <Eye className="w-4 h-4" /> },
        { label: "Data Usage", value: "Analytics Enabled", icon: <Database className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-10 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 mb-10 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                 <Settings className="w-3 h-3" />
                 <span>System Configuration</span>
               </div>
               <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                 Global <span className="text-blue-600">Preferences</span>
               </h1>
               <p className="text-lg text-gray-500 font-medium">Fine-tune your Career Path experience.</p>
            </div>
            
            <div className="h-16 w-16 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 shrink-0">
               <Bell className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* ── Settings Sections ── */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div className="px-6 flex items-center gap-3">
                 {section.icon}
                 <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{section.title}</h2>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden divide-y divide-gray-50">
                 <div className="p-8 pb-4">
                    <p className="text-sm text-gray-500 font-medium">{section.description}</p>
                 </div>
                 
                 {section.items.map((item: any, idx) => (
                   <div key={idx} className="p-6 px-8 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-blue-600 transition-all shadow-sm">
                            {item.icon}
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                            <p className="text-sm font-bold text-gray-900 tracking-tight">{item.value}</p>
                         </div>
                      </div>
                      
                      {item.disabled ? (
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">Immutable</span>
                      ) : (
                        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-gray-300 hover:text-blue-600 hover:bg-white transition-all">
                           <ChevronRight className="w-5 h-5" />
                        </Button>
                      )}
                   </div>
                 ))}

                 {section.id === "account" && (
                    <div className="p-8 bg-blue-50/30 border-t border-blue-50">
                       <div className="flex items-start gap-4">
                          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div className="space-y-3">
                             <p className="text-sm font-black text-blue-900 uppercase tracking-tight">Direct Profile Sync</p>
                             <p className="text-xs text-blue-700/70 font-medium leading-relaxed">
                               To maintain data integrity across Career Path, primary identity updates are managed via your professional dossier.
                             </p>
                             <Button 
                               onClick={() => navigate("/edit-profile")}
                               className="h-10 px-6 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-blue-100"
                             >
                               Update Dossier <ChevronRight className="w-3.5 h-3.5" />
                             </Button>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
        
        {/* ── Footer Info ── */}
        <div className="mt-16 text-center space-y-2">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Career Path System v2.4.0</p>
           <p className="text-[10px] font-black text-gray-200 uppercase tracking-widest">End-to-End Encryption Enabled</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

