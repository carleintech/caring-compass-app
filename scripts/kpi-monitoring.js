// scripts/kpi-monitoring.js
const fs = require('fs')

class KPIMonitoringSystem {
  constructor() {
    this.kpiCategories = []
    this.dashboardConfig = {}
    this.alertThresholds = {}
  }

  async setupKPIMonitoring() {
    console.log('📊 SETTING UP KPI MONITORING SYSTEM')
    console.log('==================================')

    try {
      await this.defineBusinessKPIs()
      await this.createAnalyticsDashboard()
      await this.setupAlertSystem()
      await this.configureReportingSchedule()
      await this.createKPIDatabase()
      
      console.log('\n🎉 KPI monitoring system configured successfully!')
      
    } catch (error) {
      console.error('❌ KPI setup failed:', error.message)
      throw error
    }
  }

  async defineBusinessKPIs() {
    console.log('\n📈 Defining business KPIs...')

    this.kpiCategories = [
      {
        category: 'Customer Acquisition',
        description: 'Metrics tracking new client growth and conversion',
        kpis: [
          {
            name: 'Monthly Active Clients',
            description: 'Number of clients with active care plans',
            target: 25,
            critical: 15,
            warning: 20,
            calculation: 'COUNT(clients WHERE status = ACTIVE AND last_visit >= 30_days_ago)',
            frequency: 'daily',
            owner: 'Business Development'
          },
          {
            name: 'Lead Conversion Rate',
            description: 'Percentage of inquiries that become paying clients',
            target: 35,
            critical: 20,
            warning: 25,
            calculation: '(converted_leads / total_leads) * 100',
            frequency: 'weekly',
            owner: 'Sales & Marketing'
          },
          {
            name: 'Client Acquisition Cost (CAC)',
            description: 'Average cost to acquire a new client',
            target: 250,
            critical: 500,
            warning: 375,
            calculation: 'total_marketing_spend / new_clients_acquired',
            frequency: 'monthly',
            owner: 'Marketing'
          },
          {
            name: 'Time to First Visit',
            description: 'Days from inquiry to first care visit',
            target: 3,
            critical: 7,
            warning: 5,
            calculation: 'AVG(first_visit_date - inquiry_date)',
            frequency: 'weekly',
            owner: 'Operations'
          }
        ]
      },

      {
        category: 'Service Quality',
        description: 'Metrics measuring care quality and client satisfaction',
        kpis: [
          {
            name: 'Client Satisfaction Score',
            description: 'Average client satisfaction rating (1-5 scale)',
            target: 4.5,
            critical: 3.5,
            warning: 4.0,
            calculation: 'AVG(satisfaction_ratings)',
            frequency: 'weekly',
            owner: 'Care Services'
          },
          {
            name: 'EVV Compliance Rate',
            description: 'Percentage of visits with proper EVV documentation',
            target: 99,
            critical: 95,
            warning: 97,
            calculation: '(visits_with_evv / total_visits) * 100',
            frequency: 'daily',
            owner: 'Compliance'
          },
          {
            name: 'Visit Completion Rate',
            description: 'Percentage of scheduled visits that are completed',
            target: 97,
            critical: 90,
            warning: 94,
            calculation: '(completed_visits / scheduled_visits) * 100',
            frequency: 'daily',
            owner: 'Operations'
          },
          {
            name: 'Incident Rate',
            description: 'Number of reported incidents per 1000 visits',
            target: 2,
            critical: 10,
            warning: 5,
            calculation: '(total_incidents / total_visits) * 1000',
            frequency: 'weekly',
            owner: 'Risk Management'
          },
          {
            name: 'Family Portal Engagement',
            description: 'Percentage of families actively using portal monthly',
            target: 80,
            critical: 50,
            warning: 65,
            calculation: '(active_family_users / total_families) * 100',
            frequency: 'monthly',
            owner: 'Technology'
          }
        ]
      },

      {
        category: 'Workforce Management',
        description: 'Metrics tracking caregiver performance and retention',
        kpis: [
          {
            name: 'Caregiver Retention Rate',
            description: 'Percentage of caregivers retained over 12 months',
            target: 85,
            critical: 70,
            warning: 80,
            calculation: '(caregivers_12mo_ago_still_active / caregivers_12mo_ago) * 100',
            frequency: 'monthly',
            owner: 'Human Resources'
          },
          {
            name: 'Caregiver Utilization Rate',
            description: 'Percentage of available caregiver hours that are booked',
            target: 75,
            critical: 60,
            warning: 67,
            calculation: '(booked_hours / available_hours) * 100',
            frequency: 'weekly',
            owner: 'Scheduling'
          },
          {
            name: 'Time to Fill Open Shifts',
            description: 'Average hours to fill unassigned visits',
            target: 24,
            critical: 72,
            warning: 48,
            calculation: 'AVG(assignment_time - posting_time)',
            frequency: 'daily',
            owner: 'Scheduling'
          },
          {
            name: 'Caregiver Rating Average',
            description: 'Average client rating of caregivers (1-5 scale)',
            target: 4.3,
            critical: 3.8,
            warning: 4.0,
            calculation: 'AVG(caregiver_ratings)',
            frequency: 'weekly',
            owner: 'Care Services'
          },
          {
            name: 'Training Completion Rate',
            description: 'Percentage of required training completed on time',
            target: 95,
            critical: 85,
            warning: 90,
            calculation: '(completed_trainings / required_trainings) * 100',
            frequency: 'monthly',
            owner: 'Training'
          }
        ]
      },

      {
        category: 'Financial Performance',
        description: 'Metrics tracking revenue, costs, and profitability',
        kpis: [
          {
            name: 'Monthly Recurring Revenue (MRR)',
            description: 'Predictable monthly revenue from active clients',
            target: 75000,
            critical: 40000,
            warning: 55000,
            calculation: 'SUM(monthly_client_values)',
            frequency: 'daily',
            owner: 'Finance'
          },
          {
            name: 'Revenue Per Client',
            description: 'Average monthly revenue per active client',
            target: 3000,
            critical: 2000,
            warning: 2500,
            calculation: 'total_revenue / active_clients',
            frequency: 'monthly',
            owner: 'Finance'
          },
          {
            name: 'Payment Collection Rate',
            description: 'Percentage of invoiced amounts collected within 30 days',
            target: 95,
            critical: 85,
            warning: 90,
            calculation: '(payments_received_30d / invoices_sent_30d) * 100',
            frequency: 'weekly',
            owner: 'Billing'
          },
          {
            name: 'Days Sales Outstanding (DSO)',
            description: 'Average days to collect payment after service',
            target: 15,
            critical: 30,
            warning: 22,
            calculation: '(accounts_receivable / daily_sales)',
            frequency: 'weekly',
            owner: 'Finance'
          },
          {
            name: 'Gross Margin',
            description: 'Percentage of revenue remaining after direct costs',
            target: 35,
            critical: 25,
            warning: 30,
            calculation: '((revenue - direct_costs) / revenue) * 100',
            frequency: 'monthly',
            owner: 'Finance'
          }
        ]
      },

      {
        category: 'Technology Performance',
        description: 'Metrics tracking platform performance and reliability',
        kpis: [
          {
            name: 'System Uptime',
            description: 'Percentage of time platform is available and responsive',
            target: 99.9,
            critical: 98.0,
            warning: 99.5,
            calculation: '(uptime_minutes / total_minutes) * 100',
            frequency: 'daily',
            owner: 'Technology'
          },
          {
            name: 'Average Page Load Time',
            description: 'Average time for pages to load across the platform',
            target: 2.0,
            critical: 5.0,
            warning: 3.0,
            calculation: 'AVG(page_load_times)',
            frequency: 'daily',
            owner: 'Technology'
          },
          {
            name: 'Mobile App Usage Rate',
            description: 'Percentage of users accessing via mobile devices',
            target: 60,
            critical: 40,
            warning: 50,
            calculation: '(mobile_sessions / total_sessions) * 100',
            frequency: 'weekly',
            owner: 'Technology'
          },
          {
            name: 'Error Rate',
            description: 'Number of application errors per 1000 requests',
            target: 1,
            critical: 10,
            warning: 5,
            calculation: '(error_count / total_requests) * 1000',
            frequency: 'daily',
            owner: 'Technology'
          },
          {
            name: 'Data Security Score',
            description: 'Security assessment score (1-100)',
            target: 95,
            critical: 80,
            warning: 90,
            calculation: 'weighted_security_metrics_score',
            frequency: 'weekly',
            owner: 'Security'
          }
        ]
      },

      {
        category: 'Compliance & Risk',
        description: 'Metrics ensuring regulatory compliance and risk management',
        kpis: [
          {
            name: 'Background Check Completion',
            description: 'Percentage of caregivers with completed background checks',
            target: 100,
            critical: 98,
            warning: 99,
            calculation: '(completed_checks / total_caregivers) * 100',
            frequency: 'weekly',
            owner: 'Compliance'
          },
          {
            name: 'License Renewal Rate',
            description: 'Percentage of required licenses/certifications current',
            target: 100,
            critical: 95,
            warning: 98,
            calculation: '(current_licenses / required_licenses) * 100',
            frequency: 'monthly',
            owner: 'Compliance'
          },
          {
            name: 'Audit Finding Resolution',
            description: 'Percentage of audit findings resolved within SLA',
            target: 95,
            critical: 80,
            warning: 90,
            calculation: '(resolved_findings / total_findings) * 100',
            frequency: 'monthly',
            owner: 'Compliance'
          },
          {
            name: 'Insurance Claims Rate',
            description: 'Number of insurance claims per 1000 visits',
            target: 0.5,
            critical: 2.0,
            warning: 1.0,
            calculation: '(insurance_claims / total_visits) * 1000',
            frequency: 'monthly',
            owner: 'Risk Management'
          }
        ]
      }
    ]

    console.log(`✅ Defined ${this.kpiCategories.length} KPI categories with ${this.kpiCategories.reduce((total, cat) => total + cat.kpis.length, 0)} total KPIs`)
  }

  async createAnalyticsDashboard() {
    console.log('\n📊 Creating analytics dashboard configuration...')

    this.dashboardConfig = {
      executiveDashboard: {
        title: 'Executive Overview',
        audience: ['CEO', 'COO', 'Investors'],
        refreshInterval: '15 minutes',
        widgets: [
          {
            type: 'metric_card',
            title: 'Monthly Recurring Revenue',
            kpi: 'Monthly Recurring Revenue (MRR)',
            size: 'large',
            position: { row: 1, col: 1, span: 2 }
          },
          {
            type: 'metric_card', 
            title: 'Active Clients',
            kpi: 'Monthly Active Clients',
            size: 'medium',
            position: { row: 1, col: 3, span: 1 }
          },
          {
            type: 'metric_card',
            title: 'Client Satisfaction',
            kpi: 'Client Satisfaction Score',
            size: 'medium',
            position: { row: 1, col: 4, span: 1 }
          },
          {
            type: 'line_chart',
            title: 'Revenue Trend (90 days)',
            kpis: ['Monthly Recurring Revenue (MRR)', 'Revenue Per Client'],
            size: 'large',
            position: { row: 2, col: 1, span: 3 }
          },
          {
            type: 'gauge_chart',
            title: 'System Health',
            kpis: ['System Uptime', 'EVV Compliance Rate'],
            size: 'medium',
            position: { row: 2, col: 4, span: 1 }
          },
          {
            type: 'bar_chart',
            title: 'Key Performance Indicators',
            kpis: ['Lead Conversion Rate', 'Visit Completion Rate', 'Caregiver Retention Rate'],
            size: 'large',
            position: { row: 3, col: 1, span: 4 }
          }
        ]
      },

      operationsDashboard: {
        title: 'Operations Control Center',
        audience: ['Operations Manager', 'Care Coordinators', 'Schedulers'],
        refreshInterval: '5 minutes',
        widgets: [
          {
            type: 'alert_panel',
            title: 'Active Alerts',
            size: 'full_width',
            position: { row: 1, col: 1, span: 4 }
          },
          {
            type: 'metric_grid',
            title: 'Today\'s Metrics',
            kpis: ['Visit Completion Rate', 'EVV Compliance Rate', 'Time to Fill Open Shifts'],
            size: 'large',
            position: { row: 2, col: 1, span: 2 }
          },
          {
            type: 'calendar_view',
            title: 'Upcoming Visits',
            data_source: 'scheduled_visits',
            size: 'large',
            position: { row: 2, col: 3, span: 2 }
          },
          {
            type: 'list_view',
            title: 'Open Shifts Requiring Assignment',
            data_source: 'unassigned_visits',
            size: 'medium',
            position: { row: 3, col: 1, span: 2 }
          },
          {
            type: 'map_view',
            title: 'Live Caregiver Locations',
            data_source: 'active_visits_gps',
            size: 'medium',
            position: { row: 3, col: 3, span: 2 }
          }
        ]
      },

      careDashboard: {
        title: 'Care Quality Monitor',
        audience: ['Director of Care Services', 'Quality Assurance'],
        refreshInterval: '10 minutes',
        widgets: [
          {
            type: 'satisfaction_trend',
            title: 'Client Satisfaction Trends',
            kpi: 'Client Satisfaction Score',
            size: 'large',
            position: { row: 1, col: 1, span: 3 }
          },
          {
            type: 'incident_tracker',
            title: 'Recent Incidents',
            kpi: 'Incident Rate',
            size: 'medium',
            position: { row: 1, col: 4, span: 1 }
          },
          {
            type: 'caregiver_performance',
            title: 'Top Performing Caregivers',
            kpi: 'Caregiver Rating Average',
            size: 'large',
            position: { row: 2, col: 1, span: 2 }
          },
          {
            type: 'compliance_status',
            title: 'Compliance Status',
            kpis: ['Background Check Completion', 'License Renewal Rate'],
            size: 'large',
            position: { row: 2, col: 3, span: 2 }
          }
        ]
      },

      financeDashboard: {
        title: 'Financial Performance',
        audience: ['CFO', 'Finance Team', 'Billing'],
        refreshInterval: '30 minutes',
        widgets: [
          {
            type: 'revenue_chart',
            title: 'Revenue Overview',
            kpis: ['Monthly Recurring Revenue (MRR)', 'Revenue Per Client'],
            size: 'large',
            position: { row: 1, col: 1, span: 3 }
          },
          {
            type: 'collection_status',
            title: 'Collections',
            kpis: ['Payment Collection Rate', 'Days Sales Outstanding (DSO)'],
            size: 'medium',
            position: { row: 1, col: 4, span: 1 }
          },
          {
            type: 'profitability_analysis',
            title: 'Profitability by Service',
            kpi: 'Gross Margin',
            size: 'large',
            position: { row: 2, col: 1, span: 2 }
          },
          {
            type: 'cash_flow_forecast',
            title: '90-Day Cash Flow',
            data_source: 'financial_projections',
            size: 'large',
            position: { row: 2, col: 3, span: 2 }
          }
        ]
      },

      technologyDashboard: {
        title: 'Platform Performance',
        audience: ['CTO', 'Development Team', 'DevOps'],
        refreshInterval: '1 minute',
        widgets: [
          {
            type: 'system_status',
            title: 'System Status',
            kpis: ['System Uptime', 'Average Page Load Time', 'Error Rate'],
            size: 'full_width',
            position: { row: 1, col: 1, span: 4 }
          },
          {
            type: 'performance_charts',
            title: 'Performance Metrics',
            kpis: ['Average Page Load Time', 'Error Rate'],
            size: 'large',
            position: { row: 2, col: 1, span: 2 }
          },
          {
            type: 'user_analytics',
            title: 'User Engagement',
            kpis: ['Mobile App Usage Rate', 'Family Portal Engagement'],
            size: 'large',
            position: { row: 2, col: 3, span: 2 }
          },
          {
            type: 'security_monitor',
            title: 'Security Status',
            kpi: 'Data Security Score',
            size: 'medium',
            position: { row: 3, col: 1, span: 2 }
          },
          {
            type: 'api_performance',
            title: 'API Performance',
            data_source: 'api_metrics',
            size: 'medium',
            position: { row: 3, col: 3, span: 2 }
          }
        ]
      }
    }

    // Save dashboard configurations
    fs.writeFileSync('./dashboards/executive-dashboard.json', JSON.stringify(this.dashboardConfig.executiveDashboard, null, 2))
    fs.writeFileSync('./dashboards/operations-dashboard.json', JSON.stringify(this.dashboardConfig.operationsDashboard, null, 2))
    fs.writeFileSync('./dashboards/care-dashboard.json', JSON.stringify(this.dashboardConfig.careDashboard, null, 2))
    fs.writeFileSync('./dashboards/finance-dashboard.json', JSON.stringify(this.dashboardConfig.financeDashboard, null, 2))
    fs.writeFileSync('./dashboards/technology-dashboard.json', JSON.stringify(this.dashboardConfig.technologyDashboard, null, 2))

    console.log('✅ Dashboard configurations created for 5 different audiences')
  }

  async setupAlertSystem() {
    console.log('\n🚨 Setting up KPI alert system...')

    this.alertThresholds = {
      critical: {
        description: 'Immediate action required - business impact likely',
        escalation: 'immediate',
        channels: ['sms', 'email', 'slack', 'phone'],
        recipients: ['ceo', 'coo', 'department_head'],
        conditions: [
          'System Uptime < 98%',
          'Monthly Active Clients < 15',
          'Client Satisfaction Score < 3.5',
          'Payment Collection Rate < 85%',
          'EVV Compliance Rate < 95%'
        ]
      },

      warning: {
        description: 'Attention needed - monitor closely',
        escalation: '30 minutes',
        channels: ['email', 'slack'],
        recipients: ['department_head', 'operations_manager'],
        conditions: [
          'System Uptime < 99.5%',
          'Monthly Active Clients < 20',
          'Client Satisfaction Score < 4.0',
          'Payment Collection Rate < 90%',
          'EVV Compliance Rate < 97%'
        ]
      },

      info: {
        description: 'Informational - track trends',
        escalation: '24 hours',
        channels: ['email'],
        recipients: ['department_head'],
        conditions: [
          'Lead Conversion Rate trending down 10% week-over-week',
          'Caregiver Utilization Rate < 70%',
          'Average Page Load Time > 2.5 seconds'
        ]
      },

      positive: {
        description: 'Celebrate achievements',
        escalation: 'daily_summary',
        channels: ['slack', 'email'],
        recipients: ['all_team'],
        conditions: [
          'Monthly Active Clients > target',
          'Client Satisfaction Score > 4.5',
          'System Uptime > 99.9%',
          'Revenue Per Client > target'
        ]
      }
    }

    // Create alert configuration templates
    const alertTemplates = {
      email: {
        critical: `
Subject: 🚨 CRITICAL ALERT: {kpi_name} - {current_value}

CARING COMPASS CRITICAL ALERT
============================

KPI: {kpi_name}
Current Value: {current_value}
Target: {target_value}
Threshold: {threshold_value}
Time: {timestamp}

IMMEDIATE ACTION REQUIRED

This metric has fallen below critical thresholds and requires immediate attention.

Impact: {business_impact}
Recommended Actions: {recommended_actions}

Dashboard: {dashboard_link}
Contact: {escalation_contact}
`,

        warning: `
Subject: ⚠️ WARNING: {kpi_name} - {current_value}

CARING COMPASS WARNING ALERT
===========================

KPI: {kpi_name}
Current Value: {current_value}
Target: {target_value}
Warning Threshold: {threshold_value}
Time: {timestamp}

This metric requires attention to prevent degradation.

Trend: {trend_analysis}
Next Review: {next_review_time}

Dashboard: {dashboard_link}
`,

        positive: `
Subject: 🎉 ACHIEVEMENT: {kpi_name} - {current_value}

CARING COMPASS SUCCESS ALERT
============================

Congratulations! We've achieved outstanding results:

KPI: {kpi_name}
Current Value: {current_value}
Target: {target_value}
Achievement: {achievement_percentage}% above target

Keep up the excellent work!

Team Impact: {team_contribution}
Dashboard: {dashboard_link}
`
      },

      slack: {
        critical: `🚨 *CRITICAL ALERT*
{kpi_name}: {current_value} (Target: {target_value})
Immediate action required! <{dashboard_link}|View Dashboard>`,

        warning: `⚠️ *WARNING*
{kpi_name}: {current_value} (Target: {target_value})
Monitor closely. <{dashboard_link}|View Dashboard>`,

        positive: `🎉 *ACHIEVEMENT*
{kpi_name}: {current_value} (Target: {target_value})
Great work team! <{dashboard_link}|View Dashboard>`
      }
    }

    fs.writeFileSync('./alerts/alert-thresholds.json', JSON.stringify(this.alertThresholds, null, 2))
    fs.writeFileSync('./alerts/alert-templates.json', JSON.stringify(alertTemplates, null, 2))

    console.log('✅ Alert system configured with 4 severity levels and multi-channel notifications')
  }

  async configureReportingSchedule() {
    console.log('\n📅 Configuring automated reporting schedule...')

    const reportingSchedule = {
      dailyReports: {
        schedule: '8:00 AM EST',
        recipients: ['operations_manager', 'care_director'],
        format: 'email',
        content: [
          'Yesterday\'s visit completion rate',
          'EVV compliance status',
          'Open shifts requiring assignment',
          'System uptime and performance',
          'Critical alerts summary'
        ]
      },

      weeklyReports: {
        schedule: 'Monday 9:00 AM EST',
        recipients: ['executive_team', 'department_heads'],
        format: 'pdf_email',
        content: [
          'Client acquisition and retention metrics',
          'Financial performance summary',
          'Caregiver performance and utilization',
          'Quality metrics and satisfaction scores',
          'Technology performance and security'
        ]
      },

      monthlyReports: {
        schedule: 'First Monday of month, 10:00 AM EST',
        recipients: ['board_members', 'investors', 'executive_team'],
        format: 'executive_summary',
        content: [
          'Business performance overview',
          'Financial statements and projections',
          'Growth metrics and market analysis',
          'Operational efficiency improvements',
          'Strategic initiatives progress'
        ]
      },

      quarterlyReports: {
        schedule: 'First Monday after quarter end',
        recipients: ['investors', 'board_members'],
        format: 'comprehensive_report',
        content: [
          'Quarterly business review',
          'Financial performance vs. budget',
          'Market expansion opportunities',
          'Technology roadmap progress',
          'Risk assessment and mitigation'
        ]
      },

      realTimeAlerts: {
        schedule: 'continuous',
        recipients: 'role_based',
        format: 'multi_channel',
        triggers: [
          'KPI threshold breaches',
          'System performance issues',
          'Security incidents',
          'Compliance violations',
          'Customer escalations'
        ]
      },

      customReports: {
        ad_hoc: {
          description: 'On-demand reports for specific analysis',
          requestors: ['executives', 'department_heads'],
          delivery: '24-48 hours',
          formats: ['pdf', 'excel', 'interactive_dashboard']
        },
        regulatory: {
          description: 'Compliance and regulatory reporting',
          schedule: 'as_required',
          recipients: ['compliance_team', 'legal'],
          retention: '7 years'
        }
      }
    }

    fs.writeFileSync('./reporting/schedule.json', JSON.stringify(reportingSchedule, null, 2))
    console.log('✅ Automated reporting schedule configured for daily, weekly, monthly, and quarterly reports')
  }

  async createKPIDatabase() {
    console.log('\n🗄️ Creating KPI database schema...')

    const kpiDatabaseSchema = `
-- KPI Monitoring Database Schema

-- KPI Definitions
CREATE TABLE kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    calculation_formula TEXT,
    target_value DECIMAL(10,2),
    critical_threshold DECIMAL(10,2),
    warning_threshold DECIMAL(10,2),
    unit VARCHAR(50),
    frequency VARCHAR(20),
    owner VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- KPI Values (Time Series Data)
CREATE TABLE kpi_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_id UUID REFERENCES kpi_definitions(id),
    value DECIMAL(15,4) NOT NULL,
    recorded_at TIMESTAMP NOT NULL,
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- KPI Alerts
CREATE TABLE kpi_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_id UUID REFERENCES kpi_definitions(id),
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('CRITICAL', 'WARNING', 'INFO', 'POSITIVE')),
    current_value DECIMAL(15,4),
    threshold_value DECIMAL(15,4),
    triggered_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Dashboard Configurations
CREATE TABLE dashboard_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    audience VARCHAR(100),
    refresh_interval INTEGER, -- in seconds
    layout JSONB,
    widgets JSONB,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Report Schedules
CREATE TABLE report_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100),
    schedule_cron VARCHAR(100),
    recipients JSONB,
    format VARCHAR(50),
    content_config JSONB,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_kpi_values_kpi_time ON kpi_values(kpi_id, recorded_at);
CREATE INDEX idx_kpi_values_recorded_at ON kpi_values(recorded_at);
CREATE INDEX idx_kpi_alerts_triggered ON kpi_alerts(triggered_at, alert_type);
CREATE INDEX idx_kpi_alerts_unresolved ON kpi_alerts(kpi_id, resolved_at) WHERE resolved_at IS NULL;

-- Sample Data Insertion
INSERT INTO kpi_definitions (name, category, description, calculation_formula, target_value, critical_threshold, warning_threshold, unit, frequency, owner) VALUES
('Monthly Active Clients', 'Customer Acquisition', 'Number of clients with active care plans', 'COUNT(clients WHERE status = ACTIVE)', 25, 15, 20, 'count', 'daily', 'Business Development'),
('Client Satisfaction Score', 'Service Quality', 'Average client satisfaction rating', 'AVG(satisfaction_ratings)', 4.5, 3.5, 4.0, 'rating', 'weekly', 'Care Services'),
('System Uptime', 'Technology Performance', 'Percentage of time platform is available', '(uptime_minutes / total_minutes) * 100', 99.9, 98.0, 99.5, 'percentage', 'daily', 'Technology'),
('Monthly Recurring Revenue (MRR)', 'Financial Performance', 'Predictable monthly revenue from active clients', 'SUM(monthly_client_values)', 75000, 40000, 55000, 'currency', 'daily', 'Finance');
`

    fs.writeFileSync('./database/kpi-schema.sql', kpiDatabaseSchema)

    // Create KPI data collection script
    const dataCollectionScript = `
-- KPI Data Collection Procedures

-- Daily KPI Collection
CREATE OR REPLACE FUNCTION collect_daily_kpis() RETURNS void AS $$
BEGIN
    -- Monthly Active Clients
    INSERT INTO kpi_values (kpi_id, value, recorded_at, period_start, period_end)
    SELECT 
        (SELECT id FROM kpi_definitions WHERE name = 'Monthly Active Clients'),
        COUNT(*),
        NOW(),
        DATE_TRUNC('day', NOW()),
        DATE_TRUNC('day', NOW()) + INTERVAL '1 day'
    FROM client_profiles 
    WHERE status = 'ACTIVE' 
    AND EXISTS (
        SELECT 1 FROM visits 
        WHERE client_id = client_profiles.id 
        AND scheduled_start >= NOW() - INTERVAL '30 days'
    );

    -- System Uptime
    INSERT INTO kpi_values (kpi_id, value, recorded_at, period_start, period_end)
    SELECT 
        (SELECT id FROM kpi_definitions WHERE name = 'System Uptime'),
        99.9, -- This would come from actual monitoring data
        NOW(),
        DATE_TRUNC('day', NOW()),
        DATE_TRUNC('day', NOW()) + INTERVAL '1 day';

    -- EVV Compliance Rate
    INSERT INTO kpi_values (kpi_id, value, recorded_at, period_start, period_end)
    SELECT 
        (SELECT id FROM kpi_definitions WHERE name = 'EVV Compliance Rate'),
        (SELECT (COUNT(*) FILTER (WHERE evv_events.id IS NOT NULL) * 100.0 / COUNT(*))
         FROM visits 
         LEFT JOIN evv_events ON visits.id = evv_events.visit_id
         WHERE visits.scheduled_start >= CURRENT_DATE - INTERVAL '7 days'),
        NOW(),
        DATE_TRUNC('day', NOW()),
        DATE_TRUNC('day', NOW()) + INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Schedule daily collection (would be set up with cron or scheduler)
-- SELECT cron.schedule('collect-daily-kpis', '0 1 * * *', 'SELECT collect_daily_kpis();');
`

    fs.writeFileSync('./database/kpi-collection.sql', dataCollectionScript)
    console.log('✅ KPI database schema and collection procedures created')
  }
}

module.exports = { KPIMonitoringSystem }