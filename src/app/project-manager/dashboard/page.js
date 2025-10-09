// app/project-manager/dashboard/page.js
'use client'
import { useState, useEffect } from 'react';
import PMLayout from '../../../components/pm/PMLayout.jsx';

export default function PMDashboard() {
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedThisMonth: 0,
    onSchedule: 0,
    delayed: 0,
    totalValue: 0,
    teamMembers: 0
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'project_update',
      message: 'Proyek Rumah Keluarga Budi - Survey lokasi selesai',
      time: '2 jam yang lalu',
      user: 'Tim Survey A',
      icon: '📋'
    },
    {
      id: 2,
      type: 'milestone',
      message: 'Gedung Perkantoran CV. Maju - Milestone 1 tercapai',
      time: '4 jam yang lalu',
      user: 'Project Manager',
      icon: '🎯'
    },
    {
      id: 3,
      type: 'delay',
      message: 'Renovasi Toko Sejahtera - Delay material delivery',
      time: '6 jam yang lalu',
      user: 'Site Manager',
      icon: '⚠️'
    },
    {
      id: 4,
      type: 'completion',
      message: 'Jembatan Kecil Mandonga - Fase konstruksi selesai',
      time: '1 hari yang lalu',
      user: 'Tim Konstruksi B',
      icon: '✅'
    }
  ]);

  const [activeProjects] = useState([
    {
      id: 'PRJ-001',
      name: 'Rumah Keluarga Budi',
      client: 'Budi Santoso',
      progress: 25,
      status: 'On Track',
      deadline: '2024-09-01',
      budget: 750000000,
      spent: 187500000,
      team: 'Tim Arsitek A',
      phase: 'Design & Planning'
    },
    {
      id: 'PRJ-002',
      name: 'Gedung Perkantoran CV. Maju',
      client: 'CV. Maju Bersama',
      progress: 60,
      status: 'On Track',
      deadline: '2024-12-01',
      budget: 7500000000,
      spent: 4500000000,
      team: 'Tim Project Manager',
      phase: 'Construction'
    },
    {
      id: 'PRJ-003',
      name: 'Renovasi Toko Sejahtera',
      client: 'Ahmad Rahman',
      progress: 40,
      status: 'Delayed',
      deadline: '2024-08-15',
      budget: 350000000,
      spent: 140000000,
      team: 'Tim Renovasi',
      phase: 'Construction'
    },
    {
      id: 'PRJ-004',
      name: 'Jembatan Kecil Mandonga',
      client: 'Pemda Kendari',
      progress: 85,
      status: 'On Track',
      deadline: '2024-07-30',
      budget: 2500000000,
      spent: 2125000000,
      team: 'Tim Infrastruktur',
      phase: 'Finishing'
    }
  ]);

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setStats({
        activeProjects: 8,
        completedThisMonth: 3,
        onSchedule: 6,
        delayed: 2,
        totalValue: 15250000000,
        teamMembers: 24
      });
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track':
        return 'bg-green-100 text-green-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Design & Planning':
        return 'bg-blue-100 text-blue-800';
      case 'Construction':
        return 'bg-orange-100 text-orange-800';
      case 'Finishing':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PMLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Project Manager</h1>
          <p className="mt-2 text-gray-600">Overview semua proyek dan aktivitas terkini</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Proyek Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selesai Bulan Ini</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedThisMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Schedule</p>
                <p className="text-2xl font-bold text-gray-900">{stats.onSchedule}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delayed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delayed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Nilai</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tim Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.teamMembers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Proyek Aktif</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {activeProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-500">Client: {project.client}</p>
                          <p className="text-sm text-gray-500">Team: {project.team}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">Deadline: {project.deadline}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-500">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPhaseColor(project.phase)}`}>
                            {project.phase}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Budget Usage: {Math.round((project.spent / project.budget) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <a href="/project-manager/projects" className="text-sm text-blue-600 hover:text-blue-900 font-medium">
                    Lihat semua proyek →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Aktivitas Terkini</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{activity.icon}</span>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <a href="/project-manager/monitoring" className="text-sm text-blue-600 hover:text-blue-900 font-medium">
                    Lihat semua aktivitas →
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow mt-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <a href="/project-manager/projects" className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Buat Proyek Baru
                  </a>
                  <a href="/project-manager/timeline" className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                    Update Timeline
                  </a>
                  <a href="/project-manager/team" className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                    Assign Tim
                  </a>
                  <a href="/project-manager/reports" className="block w-full bg-orange-600 text-white text-center py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
                    Generate Report
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Performance Overview</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Proyek On Time</span>
                  <span className="text-sm font-bold text-green-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Budget Compliance</span>
                  <span className="text-sm font-bold text-blue-600">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Quality Score</span>
                  <span className="text-sm font-bold text-purple-600">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Resource Allocation</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Tim Arsitek</span>
                  <span className="text-sm text-gray-900">6/8 assigned</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Tim Konstruksi</span>
                  <span className="text-sm text-gray-900">12/15 assigned</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Tim Survey</span>
                  <span className="text-sm text-gray-900">4/6 assigned</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PMLayout>
  );
}