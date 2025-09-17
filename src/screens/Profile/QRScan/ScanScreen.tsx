import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, BackHandler } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [activeTab, setActiveTab] = useState<"scan" | "myqr">("scan");

  const handleGoBack = () => {
    // If using React Navigation, you would use:
    // navigation.goBack();
    
    // For now, we'll use BackHandler to exit the app or handle back action
    BackHandler.exitApp();
  };

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  if (!permission) {
    return <View style={styles.center}><Text style={styles.loadingText}>请求权限中...</Text></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>没有相机权限</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>点击授权</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeTab === "scan" ? "QR Scan" : "我的二维码"}
        </Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {activeTab === "scan" ? (
        // 扫描二维码页面
        <View style={styles.scanPage}>
          <View style={styles.scannerContainer}>
            <View style={styles.scannerBox}>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={({ data }) => {
                  if (!scanned) {
                    setScanned(true);
                    alert(`扫描结果: ${data}`);
                  }
                }}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr", "pdf417", "ean13"],
                }}
              />
              {/* 扫描框角落装饰 */}
              <View style={styles.scanCorners}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
          </View>
          
          <Text style={styles.scanInstruction}>将二维码放入框内即可自动扫描</Text>
          
          {scanned && (
            <TouchableOpacity
              style={styles.rescanBtn}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.rescanBtnText}>重新扫描</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        // 我的二维码页面
        <View style={styles.myQrPage}>
          <View style={styles.qrCard}>
            <View style={styles.qrHeader}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?semt=ais_incoming&w=740&q=80" }}
                  style={styles.avatar}
                />
              </View>
            </View>
            <View style={styles.qrBody}>
              <View style={styles.qrContainer}>
                <QRCode value="https://example.com/invite?code=XXXXXX" size={160} />
              </View>
              <Text style={styles.referCodeLabel}>推荐码</Text>
              <Text style={styles.referCode}>XXXXXX</Text>
            </View>
          </View>
        </View>
      )}

      {/* 底部导航 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === "scan" && styles.activeNavItem]}
          onPress={() => setActiveTab("scan")}
        >
          <View style={styles.navIcon}>
            <Ionicons 
              name="qr-code-outline" 
              size={24} 
              color={activeTab === "scan" ? "#4CAF50" : "#888"} 
            />
          </View>
          <Text style={[styles.navText, activeTab === "scan" && styles.activeNavText]}>
            扫一扫
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === "myqr" && styles.activeNavItem]}
          onPress={() => setActiveTab("myqr")}
        >
          <View style={styles.navIcon}>
            <Ionicons 
              name="person-circle-outline" 
              size={24} 
              color={activeTab === "myqr" ? "#4CAF50" : "#888"} 
            />
          </View>
          <Text style={[styles.navText, activeTab === "myqr" && styles.activeNavText]}>
            我的码
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Ionicons name="grid-outline" size={24} color="#888" />
          </View>
          <Text style={styles.navText}>更多</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#1a1a1a",
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  scanPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  scannerContainer: {
    position: "relative",
    marginBottom: 40,
  },
  scannerBox: {
    width: 280,
    height: 280,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  scanCorners: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#4CAF50",
    borderWidth: 3,
  },
  topLeft: {
    top: 20,
    left: 20,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: 20,
    right: 20,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 10,
  },
  scanInstruction: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  rescanBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  rescanBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  myQrPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  qrCard: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  qrHeader: {
    backgroundColor: "#6B8E5A",
    paddingVertical: 30,
    alignItems: "center",
    position: "relative",
  },
  avatarContainer: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 8,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ddd",
  },
  qrBody: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  qrContainer: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  referCodeLabel: {
    color: "#888",
    fontSize: 14,
    marginBottom: 5,
  },
  referCode: {
    color: "#333",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 2,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    paddingVertical: 10,
    paddingBottom: 25,
    justifyContent: "space-around",
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 8,
    minWidth: 70,
  },
  activeNavItem: {
    // 可以添加激活状态的样式
  },
  navIcon: {
    marginBottom: 4,
  },
  navText: {
    color: "#888",
    fontSize: 12,
  },
  activeNavText: {
    color: "#4CAF50",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    marginBottom: 20,
  },
  permissionBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionBtnText: {
    color: "#fff",
    fontSize: 16,
  },
});