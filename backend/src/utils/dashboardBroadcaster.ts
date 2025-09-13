// Simple notification utility (replace the broadcast functionality)
interface NotificationData {
  type: 'transaction' | 'budget' | 'anomaly';
  data: any;
  timestamp: Date;
}

class DashboardBroadcaster {
  private notifications: NotificationData[] = [];

  public addNotification(type: NotificationData['type'], data: any) {
    const notification: NotificationData = {
      type,
      data,
      timestamp: new Date()
    };
    
    this.notifications.push(notification);
    
    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(-100);
    }
    
    console.log(`Dashboard notification: ${type}`, data);
  }

  public getRecentNotifications(limit: number = 10): NotificationData[] {
    return this.notifications.slice(-limit);
  }

  public clearNotifications() {
    this.notifications = [];
  }
}

export const dashboardBroadcaster = new DashboardBroadcaster();

// Helper functions
export const notifyNewTransaction = (transaction: any) => {
  dashboardBroadcaster.addNotification('transaction', transaction);
};

export const notifyNewBudget = (budget: any) => {
  dashboardBroadcaster.addNotification('budget', budget);
};

export const notifyAnomaly = (anomaly: any) => {
  dashboardBroadcaster.addNotification('anomaly', anomaly);
};
