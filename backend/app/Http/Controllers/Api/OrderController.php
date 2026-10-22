<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    public function index()
    {
        $orders = DB::table('orders as a')
            ->leftJoin('print_options as b', 'b.id', '=', 'a.paper_size')
            ->leftJoin('users as c', 'c.id', '=', 'a.user_id')
            ->select(
                'a.id',
                'c.nama',
                'a.file_name',
                'a.total_pages',
                'a.color_mode',
                'a.copies',
                'b.option_name',
                'a.notes',
                'a.total_price',
                'a.stt',
                'a.created_at'
            )
            ->orderBy('a.id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ], 200);
    }

    public function destroy($id)
    {
        $order = DB::table('orders')->where('id', $id)->first();
        if (!$order) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        DB::table('orders')->where('id', $id)->delete();

        return response()->json(['success' => true, 'message' => 'Pesanan berhasil dihapus']);
    }



public function downloadFile($id)
{
    // Ambil data order berdasarkan ID
    $order = DB::table('orders')->where('id', $id)->first();
    
    if (!$order || !$order->file_path) {
        return response()->json(['message' => 'File tidak ditemukan'], 404);
    }

    // $order->file_path berisi Google Drive file ID atau path file di disk google
    $fileId = $order->file_path; 

    // Cek apakah file ada di Google Drive
    if (!Storage::disk('google')->exists($fileId)) {
        return response()->json(['message' => 'File tidak ada di Google Drive'], 404);
    }

    // Ambil isi file dan nama aslinya untuk didownload ke browser admin
    $fileStream = Storage::disk('google')->get($fileId);
    $fileName = $order->file_name ?? 'dokumen_cetak.pdf';
    $mimeType = Storage::disk('google')->mimeType($fileId);

    return response()->streamDownload(function () use ($fileStream) {
        echo $fileStream;
    }, $fileName, ['Content-Type' => $mimeType]);
}

}