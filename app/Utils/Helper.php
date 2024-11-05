<?php

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

function cleanPagination(LengthAwarePaginator $data)
{
  $paginate = [
    'total' => $data->total(),
    'per_page' => $data->perPage(),
    'current_page' => $data->currentPage(),
    'next_page_url' => $data->nextPageUrl()
  ];

  return [
    'items' => $data->items(),
    'paginate' => $paginate
  ];
}


function uploadDocument($documentUpload, $documentFolderName)
{
    // Get original filename and extension
    $originalFilename = pathinfo($documentUpload->getClientOriginalName(), PATHINFO_FILENAME);
    $extension = $documentUpload->getClientOriginalExtension();
    
    // Clean the filename
    $filename = str_replace([' ', '-'], '_', $originalFilename);
    
    // Create unique identifier
    $uniqueIdentifier = uniqid();
    $combinedIdentifier = $filename . '_' . $uniqueIdentifier;
    $uniqueFilenameWithExtension = $combinedIdentifier . '.' . $extension;
    
    // Store file in public disk
    $filePath = Storage::disk('public')->put(
        $documentFolderName . '/' . $uniqueFilenameWithExtension,
        file_get_contents($documentUpload)
    );
    
    // Generate public URL
    $fileUrl = Storage::disk('public')->url($documentFolderName . '/' . $uniqueFilenameWithExtension);
    
    return $fileUrl;
}

function formateDateTime($dateTime, $format)
{
  return \Carbon\Carbon::parse($dateTime)->format($format);
}

function currentDatetime()
{
  return now('Asia/Phnom_Penh');
}
